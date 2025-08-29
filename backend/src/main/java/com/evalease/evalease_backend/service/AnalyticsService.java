package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.dto.QuestionAnalyticsDTO;
import com.evalease.evalease_backend.dto.SentimentResult;
import com.evalease.evalease_backend.dto.SessionAnalyticsDTO;
import com.evalease.evalease_backend.entity.*;
import com.evalease.evalease_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final FormRepository formRepository;
    private final SubmittedFormRepository submittedFormRepository;
    private final ResponseRepository responseRepository;
    private final QuestionRepository questionRepository;
    private final SentimentService sentimentService;

    @Autowired
    public AnalyticsService(FormRepository formRepository,
                             SubmittedFormRepository submittedFormRepository,
                             ResponseRepository responseRepository,
                             QuestionRepository questionRepository,
                             SentimentService sentimentService) {
        this.formRepository = formRepository;
        this.submittedFormRepository = submittedFormRepository;
        this.responseRepository = responseRepository;
        this.questionRepository = questionRepository;
        this.sentimentService = sentimentService;
    }

    public List<QuestionAnalyticsDTO> getQuestionAnalyticsByFormId(Long formId) {
        List<QuestionAnalyticsDTO> analyticsList = new ArrayList<>();

        List<Question> questions = questionRepository.findByFormId(formId);

        for (Question question : questions) {
            String type = question.getType();
            String title = question.getTitle();
            Map<String, Long> optionCounts = new HashMap<>();

            List<Response> responses = responseRepository.findAll().stream()
                    .filter(resp -> resp.getQuestion().getId().equals(question.getId()))
                    .collect(Collectors.toList());

            if (type.equalsIgnoreCase("paragraph") || type.equalsIgnoreCase("text") || type.equalsIgnoreCase("textarea")) {
                List<String> textAnswers = responses.stream()
                        .map(Response::getAnswer)
                        .filter(Objects::nonNull)
                        .filter(ans -> !ans.trim().isEmpty())
                        .collect(Collectors.toList());

                if (!textAnswers.isEmpty()) {
                    SentimentResult sentimentResult = sentimentService.analyzeSentimentBatch(textAnswers);
                    optionCounts.put("Positive", (long) sentimentResult.getPositiveCount());
                    optionCounts.put("Negative", (long) sentimentResult.getNegativeCount());
                    optionCounts.put("Neutral", (long) sentimentResult.getNeutralCount());
                }
            } else if (type.equalsIgnoreCase("checkbox")) {
                for (Response response : responses) {
                    if (response.getAnswer() != null) {
                        String[] selectedOptions = response.getAnswer().split(",");
                        for (String opt : selectedOptions) {
                            optionCounts.put(opt.trim(), optionCounts.getOrDefault(opt.trim(), 0L) + 1);
                        }
                    }
                }
            } else if (type.equalsIgnoreCase("rating")) {
                for (Response response : responses) {
                    if (response.getAnswer() != null) {
                        optionCounts.put(response.getAnswer(), optionCounts.getOrDefault(response.getAnswer(), 0L) + 1);
                    }
                }
            } else {
                for (Response response : responses) {
                    if (response.getAnswer() != null) {
                        optionCounts.put(response.getAnswer(), optionCounts.getOrDefault(response.getAnswer(), 0L) + 1);
                    }
                }
            }

            QuestionAnalyticsDTO dto = new QuestionAnalyticsDTO();
            dto.setQuestionText(title);
            dto.setQuestionType(type);
            dto.setSectionName("Section 1");
            dto.setOptionCounts(optionCounts);

            analyticsList.add(dto);
        }
        return analyticsList;
    }

    public SessionAnalyticsDTO getSessionAnalytics(Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) {
            throw new RuntimeException("Form not found with id: " + formId);
        }

        Form form = formOpt.get();
        List<SubmittedForm> submittedForms = submittedFormRepository.findByFormId(formId);

        List<String> textAnswers = new ArrayList<>();
        int ratingCount = 0;
        double totalRating = 0.0;

        for (SubmittedForm submittedForm : submittedForms) {
            for (Response response : submittedForm.getResponses()) {
                String qType = response.getQuestion().getType();
                String ans = response.getAnswer();

                if (qType.equalsIgnoreCase("text") || qType.equalsIgnoreCase("textarea") || qType.equalsIgnoreCase("paragraph")) {
                    if (ans != null && !ans.isEmpty()) {
                        textAnswers.add(ans);
                    }
                } else if (qType.equalsIgnoreCase("rating")) {
                    try {
                        totalRating += Double.parseDouble(ans);
                        ratingCount++;
                    } catch (Exception ignored) {}
                }
            }
        }

        SentimentResult sentimentResult = sentimentService.analyzeSentimentBatch(textAnswers);

        SessionAnalyticsDTO dto = new SessionAnalyticsDTO();
        dto.setFormId(formId);
        dto.setQuestionCount(form.getQuestions().size());
        dto.setTotalResponses(submittedForms.size());
        dto.setAverageRating(ratingCount > 0 ? totalRating / ratingCount : 0.0);
        dto.setSentiment(sentimentResult);
        dto.setQuestions(getQuestionAnalyticsByFormId(formId));

        return dto;
    }
}
