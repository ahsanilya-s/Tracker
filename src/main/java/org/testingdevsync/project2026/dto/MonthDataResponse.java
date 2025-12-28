package org.testingdevsync.project2026.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MonthDataResponse {
    private List<GoalDTO> goals;
    private Map<String, String> moods;
}
