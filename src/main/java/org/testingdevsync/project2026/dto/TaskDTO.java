package org.testingdevsync.project2026.dto;

import lombok.Data;

@Data
public class TaskDTO {
    private String id;
    private String name;
    private String description;
    private boolean[][] weekCompletions;
}
