package org.testingdevsync.project2026.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "goals", indexes = {
    @Index(name = "idx_user_goal", columnList = "user_id,goal_id"),
    @Index(name = "idx_created", columnList = "created_at")
})
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "goal_id", nullable = false, length = 50)
    private String goalId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
