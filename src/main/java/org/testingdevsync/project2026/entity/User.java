package org.testingdevsync.project2026.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users", indexes = @Index(name = "idx_username", columnList = "username"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String username;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
