package com.vedataworkhub.domain.task.controller;

import com.vedataworkhub.domain.task.dto.TaskDto;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.task.model.Task;
import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@Controller
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public String createTask(@Valid @ModelAttribute TaskDto dto,
                             @AuthenticationPrincipal User currentUser,
                             RedirectAttributes ra) {
        try {
            taskService.create(dto, currentUser);
            ra.addFlashAttribute("success", "Tarefa criada!");
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/projects/" + dto.getProjectId();
    }

    @PostMapping("/{id}/update")
    public String updateTask(@PathVariable Long id,
                             @Valid @ModelAttribute TaskDto dto,
                             @AuthenticationPrincipal User currentUser,
                             RedirectAttributes ra) {
        try {
            Task task = taskService.update(id, dto, currentUser);
            ra.addFlashAttribute("success", "Tarefa atualizada!");
            return "redirect:/projects/" + task.getProject().getId();
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage());
            return "redirect:/projects";
        }
    }

    @PostMapping("/{id}/status")
    @ResponseBody
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        try {
            Task.TaskStatus newStatus = Task.TaskStatus.valueOf(status);
            Task task = taskService.updateStatus(id, newStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "status", task.getStatus().name(),
                "label", task.getStatus().getLabel(),
                "progress", task.getProgress()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/progress")
    @ResponseBody
    public ResponseEntity<?> updateProgress(@PathVariable Long id,
                                            @RequestParam int progress) {
        try {
            Task task = taskService.updateProgress(id, progress);
            return ResponseEntity.ok(Map.of("success", true, "progress", task.getProgress()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/delete")
    @ResponseBody
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.delete(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> getTask(@PathVariable Long id) {
        return taskService.findById(id)
            .map(task -> ResponseEntity.ok(Map.of(
                "id", task.getId(),
                "title", task.getTitle(),
                "description", task.getDescription() != null ? task.getDescription() : "",
                "status", task.getStatus().name(),
                "priority", task.getPriority().name(),
                "progress", task.getProgress(),
                "dueDate", task.getDueDate() != null ? task.getDueDate().toString() : "",
                "assigneeId", task.getAssignee() != null ? task.getAssignee().getId() : "",
                "projectId", task.getProject().getId()
            )))
            .orElse(ResponseEntity.notFound().build());
    }
}
