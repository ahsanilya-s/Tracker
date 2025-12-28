package org.testingdevsync.project2026.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_goal_task", columnList = "goal_id,task_id"),
    @Index(name = "idx_created", columnList = "created_at")
})
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "goal_id", nullable = false)
    private Long goalId;
    
    @Column(name = "task_id", nullable = false, length = 50)
    private String taskId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
