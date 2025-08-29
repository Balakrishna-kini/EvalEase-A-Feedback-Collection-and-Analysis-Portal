package com.evalease.evalease_backend.controller;

import com.evalease.evalease_backend.dto.FormDTO;
import com.evalease.evalease_backend.dto.RecentFormDTO;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.evalease.evalease_backend.repository.FormRepository; 
import com.evalease.evalease_backend.dto.FormSummaryDTO;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "http://localhost:8081") // Adjust based on frontend port
public class FormController {

    @Autowired
    private FormService formService;

    @PostMapping
    public ResponseEntity<?> createForm(@RequestBody FormDTO formDTO) {
        try {
            Form savedForm = formService.saveForm(formDTO);
            return ResponseEntity.ok(savedForm);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Form>> getAllForms() {
        List<Form> forms = formService.getAllForms();
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormDTO> getFormById(@PathVariable Long id) {
        FormDTO formDTO = formService.getFormDTOById(id);
        return ResponseEntity.ok(formDTO);
    }

    @Autowired
    private FormRepository formRepository;
    
    @GetMapping("/recent")
    public ResponseEntity<List<RecentFormDTO>> getRecentForms() {
        List<RecentFormDTO> recentForms = formService.getRecentForms();
        return ResponseEntity.ok(recentForms);
    }

}
