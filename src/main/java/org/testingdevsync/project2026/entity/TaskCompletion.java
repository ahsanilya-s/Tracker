package org.testingdevsync.project2026.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "task_completions", 
    uniqueConstraints = @UniqueConstraint(name = "unique_task_date", columnNames = {"task_id", "completion_date"}),
    indexes = {
        @Index(name = "idx_date", columnList = "completion_date"),
        @Index(name = "idx_year_month", columnList = "year,month"),
        @Index(name = "idx_task_date", columnList = "task_id,completion_date")
    })
public class TaskCompletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "task_id", nullable = false)
    private Long taskId;
    
    @Column(name = "completion_date", nullable = false)
    private LocalDate completionDate;
    
    @Column(nullable = false)
    private Short year;
    
    @Column(nullable = false)
    private Byte month;
    
    @Column(nullable = false)
    private Byte day;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
