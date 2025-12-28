package org.testingdevsync.project2026.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingdevsync.project2026.entity.Mood;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {
    List<Mood> findByUserIdAndYearAndMonth(Long userId, Short year, Byte month);
    Optional<Mood> findByUserIdAndMoodDate(Long userId, LocalDate date);
}
