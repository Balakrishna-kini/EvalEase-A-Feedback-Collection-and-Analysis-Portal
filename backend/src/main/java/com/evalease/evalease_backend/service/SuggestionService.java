package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.dto.TrainerSuggestionDTO;
import com.evalease.evalease_backend.entity.*;
import com.evalease.evalease_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private FormRepository formRepo;
    @Autowired
    private SubmittedFormRepository submittedFormRepo;

    // A rule-based system for keywords in text-based questions.
    // NOTE: The keys in this map must exactly match the keywords you are searching
    // for.
    private static final Map<String, String> TEXT_KEYWORD_RULES = Map.of(
            "boring",
            "Review the presentation materials and find ways to make the content more interactive and engaging.",
            "confusing", "Clarify complex topics with more examples or visual aids.",
            "fast", "Adjust the pace to better suit the audience's needs.",
            "unclear", "Ensure that your explanations are clear and easy to follow. Provide more examples.",
            "slow", "Consider increasing the pace to keep the audience engaged.",
            "pace", "Work on improving delivery clarity or pacing to address concerns.",
            "communication", "Focus on improving communication clarity and engagement during presentations.",
            "no","Some have mentioned for no improvement. ");

    public List<TrainerSuggestionDTO> getSuggestions(Long formId) {
        Form form = formRepo.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        List<SubmittedForm> submissions = submittedFormRepo.findByFormId(formId);

        List<TrainerSuggestionDTO> suggestions = new ArrayList<>();

        // Always include a general default self-improvement suggestion
        suggestions.add(new TrainerSuggestionDTO(
                "Professional development",
                "Learning never stops.",
                "Consider attending a teaching workshop or seeking peer feedback."));

        if (submissions.isEmpty()) {
            return suggestions;
        }

        // Iterate through all questions in the form
        for (Question q : form.getQuestions()) {
            // Log the question title for debugging
            System.out.println("Processing question: " + q.getTitle() + " (Type: " + q.getType() + ")");

            List<Response> allResponses = submissions.stream()
                    .flatMap(sf -> sf.getResponses().stream())
                    .filter(r -> r.getQuestion().getId().equals(q.getId()))
                    .collect(Collectors.toList());

            if (allResponses.isEmpty())
                continue;

            boolean isSuggestionGenerated = false; // Flag to track if a suggestion was added for this question

            switch (q.getType().toLowerCase()) {
                case "rating": {
                    double avg = allResponses.stream()
                            .mapToDouble(r -> {
                                try {
                                    return Double.parseDouble(r.getAnswer());
                                } catch (Exception e) {
                                    return 0;
                                }
                            })
                            .average()
                            .orElse(0.0);

                    TrainerSuggestionDTO suggestionForQuestion;
                    if (avg < 3.5) {
                        suggestionForQuestion = new TrainerSuggestionDTO(
                                q.getTitle(),
                                "Low average rating: " + String.format("%.2f", avg),
                                "Revisit this topic or improve delivery methods to boost engagement.");
                    } else if (avg >= 4.5) {
                        suggestionForQuestion = new TrainerSuggestionDTO(
                                q.getTitle(),
                                "High rating: " + String.format("%.2f", avg),
                                "Keep up the good work on this topic, you are above average..!");
                    } else {
                        suggestionForQuestion = new TrainerSuggestionDTO(
                                q.getTitle(),
                                "Average rating: " + String.format("%.2f", avg),
                                "Maintain performance and look for areas of quality improvement.");
                    }
                    break;
                }

                case "text":
                case "textarea":
                    // Dynamic keyword analysis from a hard-coded map
                    Map<String, Long> keywordCount = allResponses.stream()
                            .map(Response::getAnswer)
                            .flatMap(answer -> Arrays.stream(answer.toLowerCase().split("\\s+")))
                            .filter(TEXT_KEYWORD_RULES::containsKey)
                            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

                    if (!keywordCount.isEmpty()) {
                        String keywords = String.join(", ", keywordCount.keySet());
                        // Create a single consolidated suggestion based on the found keywords
                        suggestions.add(new TrainerSuggestionDTO(
                                q.getTitle(),
                                "Frequent negative keywords: " + keywords,
                                "Review feedback for this question and address the mentioned concerns about " + keywords
                                        + "."));
                        isSuggestionGenerated = true;
                    }

                    // Original short answer logic
                    long shortAnswers = allResponses.stream()
                            .filter(r -> r.getAnswer().length() < 5)
                            .count();

                    if (shortAnswers > submissions.size() / 2) {
                        suggestions.add(new TrainerSuggestionDTO(
                                q.getTitle(),
                                "Many short/incomplete responses",
                                "Consider asking more specific or guided questions."));
                        isSuggestionGenerated = true;
                    }
                    break;

                case "multiple":
                    // Analyze multiple-choice questions dynamically
                    Map<String, Long> mcqOptionCount = allResponses.stream()
                            .map(r -> r.getAnswer().trim())
                            .filter(option -> !option.isEmpty())
                            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

                    // Log the option counts for debugging
                    System.out.println("Multiple choice option counts: " + mcqOptionCount);

                    if (!mcqOptionCount.isEmpty()) {
                        long totalResponses = allResponses.size();
                        Optional<Map.Entry<String, Long>> mostPopularOption = mcqOptionCount.entrySet().stream()
                                .max(Map.Entry.comparingByValue());

                        if (mostPopularOption.isPresent()) {
                            String popularOption = mostPopularOption.get().getKey();
                            long popularCount = mostPopularOption.get().getValue();
                            double popularPercentage = (double) popularCount / totalResponses;

                            if (popularPercentage > 0.7) {
                                suggestions.add(new TrainerSuggestionDTO(
                                        q.getTitle(),
                                        "Majority of participants selected: " + popularOption,
                                        "The answer may have been too obvious. Consider rephrasing the question or diversifying the options."));
                            } else if (popularPercentage > 0.3) {
                                suggestions.add(new TrainerSuggestionDTO(
                                        q.getTitle(),
                                        "A significant number of participants chose: " + popularOption,
                                        "Review the topic related to this option to see if it needs more emphasis or clarity."));
                            } else {
                                suggestions.add(new TrainerSuggestionDTO(
                                        q.getTitle(),
                                        "Responses were diverse with no clear trend.",
                                        "This could indicate a well-balanced question or that the topic requires more discussion. Review the individual responses."));
                            }
                            isSuggestionGenerated = true; // Suggestion was generated
                        }
                    }
                    break;

                case "checkbox":
                    // Analyze checkbox questions dynamically, finding all options with the highest
                    // vote count.
                    Map<String, Long> cbOptionCount = allResponses.stream()
                            .flatMap(r -> Arrays.stream(r.getAnswer().split(",")))
                            .map(option -> option.trim().replaceAll("[\\[\\]]", "")) // Clean up brackets from the
                                                                                     // string
                            .filter(option -> !option.isEmpty())
                            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

                    if (!cbOptionCount.isEmpty()) {
                        long totalResponses = allResponses.size();
                        Optional<Long> maxCountOptional = cbOptionCount.values().stream().max(Long::compare);

                        if (maxCountOptional.isPresent()) {
                            long maxCount = maxCountOptional.get();
                            List<String> topVotedOptions = cbOptionCount.entrySet().stream()
                                    .filter(entry -> entry.getValue().equals(maxCount))
                                    .map(Map.Entry::getKey)
                                    .collect(Collectors.toList());

                            // Only generate suggestions if the top voted options were selected by a
                            // significant number of people.
                            if (maxCount > totalResponses * 0.3) {
                                String combinedOptions = String.join(", ", topVotedOptions);
                                suggestions.add(new TrainerSuggestionDTO(
                                        q.getTitle(),
                                        "Top-voted areas for improvement: " + combinedOptions,
                                        "Focus on the topics related to '" + combinedOptions
                                                + "' as they were popular selections for improvement."));
                                isSuggestionGenerated = true;
                            } else {
                                suggestions.add(new TrainerSuggestionDTO(
                                        q.getTitle(),
                                        "Responses were diverse with no single top-voted option.",
                                        "The audience provided a variety of feedback. Review all checkbox options for a comprehensive view."));
                                isSuggestionGenerated = true;
                            }
                        }
                    }
                    break;
            }

            // Fallback: If no specific suggestion was generated, add a generic one.
            if (!isSuggestionGenerated) {
                suggestions.add(new TrainerSuggestionDTO(
                        q.getTitle(),
                        "Review feedback for this question.",
                        "No specific trends were found, but individual responses may be insightful."));
            }
        }

        return suggestions;
    }
}
