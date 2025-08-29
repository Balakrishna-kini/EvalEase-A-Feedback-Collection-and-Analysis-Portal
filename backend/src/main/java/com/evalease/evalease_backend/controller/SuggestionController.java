package com.evalease.evalease_backend.controller;

import com.evalease.evalease_backend.dto.TrainerSuggestionDTO;
import com.evalease.evalease_backend.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms/suggestions")
@CrossOrigin(origins = "http://localhost:8081")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    @GetMapping("/{formId}")
    public List<TrainerSuggestionDTO> getSuggestions(@PathVariable Long formId) {
        return suggestionService.getSuggestions(formId);
    }
}
