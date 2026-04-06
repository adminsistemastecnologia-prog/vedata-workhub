package com.vedataworkhub.domain.task.service;

import com.vedataworkhub.domain.task.dto.TaskDto;
import com.vedataworkhub.domain.task.model.Task;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.task.repository.TaskRepository;
import com.vedataworkhub.domain.user.repository.UserRepository;
import com.vedataworkhub.domain.project.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Task create(TaskDto dto, User creator) {
        Project project = projectRepository.findById(dto.getProjectId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        User assignee = null;
        if (dto.getAssigneeId() != null) {
            assignee = userRepository.findById(dto.getAssigneeId()).orElse(null);
        }

        long count = taskRepository.countByProject(dto.getProjectId());

        Task task = Task.builder()
            .title(dto.getTitle())
            .description(dto.getDescription())
            .status(dto.getStatus() != null ? dto.getStatus() : Task.TaskStatus.BACKLOG)
            .priority(dto.getPriority() != null ? dto.getPriority() : Task.TaskPriority.MEDIUM)
            .progress(dto.getProgress() != null ? dto.getProgress() : 0)
            .dueDate(dto.getDueDate())
            .project(project)
            .assignee(assignee)
            .creator(creator)
            .position((int) count)
            .build();

        return taskRepository.save(task);
    }

    public Task update(Long id, TaskDto dto, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getProgress() != null) task.setProgress(dto.getProgress());
        task.setDueDate(dto.getDueDate());

        if (dto.getAssigneeId() != null) {
            userRepository.findById(dto.getAssigneeId()).ifPresent(task::setAssignee);
        } else {
            task.setAssignee(null);
        }

        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, Task.TaskStatus newStatus) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        task.setStatus(newStatus);
        if (newStatus == Task.TaskStatus.DONE) {
            task.setProgress(100);
        }
        return taskRepository.save(task);
    }

    public Task updateProgress(Long id, int progress) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        task.setProgress(Math.max(0, Math.min(100, progress)));
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> findByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderByPositionAsc(projectId);
    }

    public Map<Task.TaskStatus, List<Task>> findByProjectGroupedByStatus(Long projectId) {
        List<Task> all = taskRepository.findByProjectIdOrderByPositionAsc(projectId);
        Map<Task.TaskStatus, List<Task>> grouped = new LinkedHashMap<>();

        for (Task.TaskStatus status : Task.TaskStatus.values()) {
            grouped.put(status, new ArrayList<>());
        }

        for (Task task : all) {
            grouped.get(task.getStatus()).add(task);
        }

        return grouped;
    }

    public List<Task> findActiveTasks(User user) {
        return taskRepository.findActiveTasks(user);
    }

    public Map<String, Long> getStatsByProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectIdOrderByPositionAsc(projectId);
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) tasks.size());
        stats.put("done", tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.DONE).count());
        stats.put("inProgress", tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS).count());
        stats.put("overdue", tasks.stream().filter(Task::isOverdue).count());
        return stats;
    }
}
