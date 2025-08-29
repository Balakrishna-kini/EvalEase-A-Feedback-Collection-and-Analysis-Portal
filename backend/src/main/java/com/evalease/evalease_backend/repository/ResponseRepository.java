package com.evalease.evalease_backend.repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.evalease.evalease_backend.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    @Query("SELECT COUNT(r) FROM Response r WHERE r.submittedForm.form.id = :formId")
    long countByFormId(@Param("formId") Long formId);
    long countBySubmittedForm_Form_Id(Long formId);


    @Query("SELECT COUNT(s) FROM SubmittedForm s")
    int countAllResponses();

    @Query(value = """
        SELECT AVG(CAST(r.answer AS DECIMAL)) FROM response r
        JOIN question q ON r.question_id = q.id
        WHERE q.type = 'rating' LIMIT 1000
        """, nativeQuery = true)
    Double findAverageRatingForRatingQuestions();
}