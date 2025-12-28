package org.testingdevsync.project2026.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.testingdevsync.project2026.entity.Task;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByGoalIdAndDeletedAtIsNull(Long goalId);
    Optional<Task> findByGoalIdAndTaskIdAndDeletedAtIsNull(Long goalId, String taskId);
}
