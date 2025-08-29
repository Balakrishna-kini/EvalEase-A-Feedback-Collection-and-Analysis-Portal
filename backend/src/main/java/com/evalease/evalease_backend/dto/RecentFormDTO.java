package com.evalease.evalease_backend.dto;
import com.evalease.evalease_backend.entity.Form;

import java.time.Instant;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentFormDTO {
    private Long formId;
    private String title;
    private Instant createdAt;
    private Long responseCount;
}