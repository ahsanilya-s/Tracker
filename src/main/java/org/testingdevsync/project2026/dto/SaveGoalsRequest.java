package org.testingdevsync.project2026.dto;

import lombok.Data;
import java.util.List;

@Data
public class SaveGoalsRequest {
    private String username;
    private int year;
    private int month;
    private List<GoalDTO> goals;
}
