package com.evalease.evalease_backend.repository;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import com.evalease.evalease_backend.dto.RecentFormDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.evalease.evalease_backend.entity.Form;
import java.util.List;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {

    @Query("SELECT DISTINCT f FROM Form f " +
            "LEFT JOIN FETCH f.questions q " +
            "LEFT JOIN FETCH q.options " +
            "WHERE f.id = :id")
    Optional<Form> findFormWithQuestionsAndOptions(@Param("id") Long id);

    Optional<Form> findByTitle(String title);
    @Query("SELECT new com.evalease.evalease_backend.dto.RecentFormDTO(f.id, f.title, f.createdAt, COUNT(sf)) " +
        "FROM Form f LEFT JOIN SubmittedForm sf ON sf.form = f " +
        "GROUP BY f.id, f.title, f.createdAt " +
        "ORDER BY f.createdAt DESC")
    List<RecentFormDTO> findTop5RecentFormsWithResponseCount(Pageable pageable);

    @Query("SELECT COUNT(f) FROM Form f")
    int countAllForms();
}