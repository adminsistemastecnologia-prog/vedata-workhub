package com.vedataworkhub.domain.project.controller;

import com.vedataworkhub.domain.project.dto.ProjectDto;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.task.model.Task;
import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.project.service.ProjectService;
import com.vedataworkhub.domain.task.service.TaskService;
import com.vedataworkhub.domain.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    @Autowired private ProjectService projectService;
    @Autowired private TaskService taskService;
    @Autowired private UserService userService;

    @GetMapping
    public String listProjects(@AuthenticationPrincipal User currentUser, Model model) {
        List<Project> projects = projectService.findAllByUser(currentUser);
        model.addAttribute("projects", projects);
        model.addAttribute("user", currentUser);
        model.addAttribute("dto", new ProjectDto());
        return "projects/list";
    }

    @PostMapping("/create")
    public String createProject(@Valid @ModelAttribute("dto") ProjectDto dto,
                                BindingResult result,
                                @AuthenticationPrincipal User currentUser,
                                RedirectAttributes ra, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("projects", projectService.findAllByUser(currentUser));
            model.addAttribute("user", currentUser);
            model.addAttribute("showModal", true);
            return "projects/list";
        }
        Project project = projectService.create(dto, currentUser);
        ra.addFlashAttribute("success", "Projeto criado com sucesso!");
        return "redirect:/projects/" + project.getId();
    }

    @GetMapping("/{id}")
    public String viewProject(@PathVariable Long id,
                              @AuthenticationPrincipal User currentUser,
                              Model model) {
        Project project = projectService.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!project.isMember(currentUser) && currentUser.getRole() != User.Role.ADMIN) {
            return "redirect:/projects?error=access";
        }

        Map<Task.TaskStatus, List<Task>> tasksByStatus = taskService.findByProjectGroupedByStatus(id);
        Map<String, Long> stats = taskService.getStatsByProject(id);
        List<User> allUsers = userService.findAll();

        model.addAttribute("project", project);
        model.addAttribute("tasksByStatus", tasksByStatus);
        model.addAttribute("taskStatuses", Task.TaskStatus.values());
        model.addAttribute("taskPriorities", Task.TaskPriority.values());
        model.addAttribute("stats", stats);
        model.addAttribute("allUsers", allUsers);
        model.addAttribute("user", currentUser);
        return "projects/kanban";
    }

    @PostMapping("/{id}/update")
    public String updateProject(@PathVariable Long id,
                                @Valid @ModelAttribute ProjectDto dto,
                                BindingResult result,
                                @AuthenticationPrincipal User currentUser,
                                RedirectAttributes ra) {
        if (result.hasErrors()) {
            ra.addFlashAttribute("error", "Dados inválidos.");
            return "redirect:/projects/" + id;
        }
        projectService.update(id, dto, currentUser);
        ra.addFlashAttribute("success", "Projeto atualizado!");
        return "redirect:/projects/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deleteProject(@PathVariable Long id,
                                @AuthenticationPrincipal User currentUser,
                                RedirectAttributes ra) {
        projectService.delete(id, currentUser);
        ra.addFlashAttribute("success", "Projeto excluído.");
        return "redirect:/projects";
    }

    @PostMapping("/{id}/members/add")
    @ResponseBody
    public ResponseEntity<?> addMember(@PathVariable Long id,
                                       @RequestParam Long userId,
                                       @AuthenticationPrincipal User currentUser) {
        try {
            projectService.addMember(id, userId, currentUser);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/members/remove")
    @ResponseBody
    public ResponseEntity<?> removeMember(@PathVariable Long id,
                                          @RequestParam Long userId,
                                          @AuthenticationPrincipal User currentUser) {
        try {
            projectService.removeMember(id, userId, currentUser);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
