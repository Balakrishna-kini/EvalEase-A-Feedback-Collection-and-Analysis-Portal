package com.evalease.evalease_backend.repository;

import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.SubmittedForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeFormStatusRepository extends JpaRepository<SubmittedForm, Long> {
    // Finds all submitted forms associated with a specific Employee entity
    List<SubmittedForm> findByEmployee(Employee employee);

    // Finds a specific submitted form by its original form ID and the submitting Employee
    Optional<SubmittedForm> findByFormIdAndEmployee(Long formId, Employee employee);
}