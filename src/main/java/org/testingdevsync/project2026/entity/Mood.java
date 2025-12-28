package org.testingdevsync.project2026.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "moods",
    uniqueConstraints = @UniqueConstraint(name = "unique_user_date", columnNames = {"user_id", "mood_date"}),
    indexes = {
        @Index(name = "idx_user_date", columnList = "user_id,mood_date"),
        @Index(name = "idx_year_month", columnList = "year,month")
    })
public class Mood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "mood_date", nullable = false)
    private LocalDate moodDate;
    
    @Column(nullable = false)
    private Short year;
    
    @Column(nullable = false)
    private Byte month;
    
    @Column(nullable = false)
    private Byte day;
    
    @Column(nullable = false, length = 10)
    private String emoji;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
