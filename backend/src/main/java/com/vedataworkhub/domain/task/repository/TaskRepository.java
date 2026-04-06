package com.vedataworkhub.domain.task.repository;

import com.vedataworkhub.domain.task.model.Task;
import com.vedataworkhub.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectIdOrderByPositionAsc(Long projectId);

    List<Task> findByProjectIdAndStatusOrderByPositionAsc(Long projectId, Task.TaskStatus status);

    List<Task> findByAssigneeOrderByCreatedAtDesc(User assignee);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.status = :status ORDER BY t.position ASC")
    List<Task> findByProjectAndStatus(@Param("projectId") Long projectId, @Param("status") Task.TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = 'DONE'")
    long countCompletedByProject(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countByProject(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Task t WHERE t.assignee = :user AND t.status != 'DONE' ORDER BY t.dueDate ASC NULLS LAST")
    List<Task> findActiveTasks(@Param("user") User user);
}
