package org.testingdevsync.project2026.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.testingdevsync.project2026.entity.TaskCompletion;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCompletionRepository extends JpaRepository<TaskCompletion, Long> {
    List<TaskCompletion> findByTaskIdAndYearAndMonth(Long taskId, Short year, Byte month);
    
    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.taskId IN :taskIds AND tc.year = :year AND tc.month = :month")
    List<TaskCompletion> findByTaskIdsAndYearAndMonth(List<Long> taskIds, Short year, Byte month);
    
    Optional<TaskCompletion> findByTaskIdAndCompletionDate(Long taskId, LocalDate date);
}
