package org.testingdevsync.project2026.dto;

import lombok.Data;
import java.util.List;

@Data
public class GoalDTO {
    private String id;
    private String name;
    private List<TaskDTO> tasks;
}
