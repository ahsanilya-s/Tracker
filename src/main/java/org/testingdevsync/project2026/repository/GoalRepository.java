package org.testingdevsync.project2026.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingdevsync.project2026.entity.Goal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserIdAndDeletedAtIsNull(Long userId);
    Optional<Goal> findByUserIdAndGoalIdAndDeletedAtIsNull(Long userId, String goalId);
}
