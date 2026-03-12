package com.evalease.evalease_backend.dto;

import java.time.Instant;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentFormDTO {

    private Long id;
    private String title;
    private Instant createdAt;
    private Long responseCount;

}