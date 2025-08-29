package com.evalease.evalease_backend.repository;

import com.evalease.evalease_backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Fetch all questions for a given form ID (if needed in your logic)
    List<Question> findByFormId(Long formId);
}
