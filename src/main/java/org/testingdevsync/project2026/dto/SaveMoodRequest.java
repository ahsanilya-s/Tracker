package org.testingdevsync.project2026.dto;

import lombok.Data;

@Data
public class SaveMoodRequest {
    private String username;
    private String date;
    private String emoji;
}
