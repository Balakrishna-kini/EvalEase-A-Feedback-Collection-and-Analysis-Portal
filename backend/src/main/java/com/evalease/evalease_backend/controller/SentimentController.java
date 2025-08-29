package com.evalease.evalease_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import org.springframework.web.bind.annotation.*;
import com.evalease.evalease_backend.dto.SentimentRequest;
import com.evalease.evalease_backend.dto.SentimentResult;
import com.evalease.evalease_backend.service.SentimentService;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class SentimentController {

    @Autowired
    private SentimentService sentimentService;

    @PostMapping("/sentiment")
    public SentimentResult getSentiment(@RequestBody SentimentRequest request) {
    	return sentimentService.analyzeSentiment(request.getText());

    }
    

}
