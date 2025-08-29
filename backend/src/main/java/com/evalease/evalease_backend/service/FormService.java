package com.evalease.evalease_backend.service;
import com.evalease.evalease_backend.dto.RecentFormDTO;

import com.evalease.evalease_backend.dto.FormDTO;
import com.evalease.evalease_backend.dto.FormDTO.QuestionDTO;
import com.evalease.evalease_backend.dto.AdminDashboardStatsDTO;

import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.entity.Question;
import com.evalease.evalease_backend.entity.OptionItem;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.repository.SubmittedFormRepository;
import com.evalease.evalease_backend.repository.ResponseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest; 

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FormService {
        @Autowired
        private ResponseRepository responseRepository;

        @Autowired
        private FormRepository formRepository;

        @Autowired
        private SubmittedFormRepository submittedFormRepository;

        public List<RecentFormDTO> getRecentForms() {
                // Use repository method with Pageable to get top 5 recent forms + response count
                return formRepository.findTop5RecentFormsWithResponseCount(PageRequest.of(0, 5));
        }
        
        // Save New Form with Questions & Options
        public Form saveForm(FormDTO formDTO) {
                if (formRepository.findAll().stream().anyMatch(f -> f.getTitle().equals(formDTO.getTitle()))) {
                        throw new IllegalArgumentException("Form with the same title already exists.");
                }

                Form form = Form.builder()
                                .title(formDTO.getTitle())
                                .description(formDTO.getDescription())
                                .createdAt(Instant.now())
                                .build();

                List<Question> questions = new ArrayList<>();

                for (QuestionDTO questionDTO : formDTO.getQuestions()) {
                        Question question = Question.builder()
                                        .title(questionDTO.getTitle())
                                        .type(questionDTO.getType())
                                        .required(questionDTO.isRequired())
                                        .ratingScale(questionDTO.getRatingScale())
                                        .form(form)
                                        .build();

                        if (questionDTO.getOptions() != null) {
                                List<OptionItem> options = questionDTO.getOptions().stream()
                                                .map(opt -> OptionItem.builder()
                                                                .value(opt)
                                                                .question(question)
                                                                .build())
                                                .collect(Collectors.toList());
                                question.setOptions(options);
                        }

                        questions.add(question);
                }

                form.setQuestions(questions);

                return formRepository.save(form);
        }

        public List<Form> getAllForms() {
                return formRepository.findAll();
        }

        public FormDTO getFormDTOById(Long id) {
                Form form = formRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Form not found with id: " + id));

                List<QuestionDTO> questionDTOs = form.getQuestions().stream()
                                .map(this::convertToQuestionDTO)
                                .collect(Collectors.toList());

                return FormDTO.builder()
                                .id(form.getId())
                                .title(form.getTitle())
                                .description(form.getDescription())
                                .createdAt(form.getCreatedAt())
                                .questions(questionDTOs)
                                .build();
        }

        private QuestionDTO convertToQuestionDTO(Question question) {
                List<String> options = question.getOptions() != null
                                ? question.getOptions().stream().map(OptionItem::getValue).collect(Collectors.toList())
                                : null;

                return QuestionDTO.builder()
                                .id(question.getId())
                                .title(question.getTitle())
                                .type(question.getType())
                                .required(question.isRequired())
                                .ratingScale(question.getRatingScale())
                                .options(options)
                                .build();
        }
        
    public AdminDashboardStatsDTO getAdminDashboardStats() {
    int totalForms = formRepository.countAllForms();
    int responses = responseRepository.countAllResponses();
    Double avgRating = responseRepository.findAverageRatingForRatingQuestions();

    return new AdminDashboardStatsDTO(
        totalForms,
        responses,
        avgRating != null ? avgRating : 0.0
    );
}

}