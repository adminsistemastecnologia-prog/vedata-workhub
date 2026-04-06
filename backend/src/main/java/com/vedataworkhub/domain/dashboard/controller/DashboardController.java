package com.vedataworkhub.domain.dashboard.controller;

import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.task.model.Task;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.project.service.ProjectService;
import com.vedataworkhub.domain.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DashboardController - API REST para dados do dashboard.
 *
 * CORREÇÃO: Convertido de @Controller (MVC com Thymeleaf) para @RestController (API JSON).
 * O mapeamento "/" foi removido para evitar conflito com o SpaController que serve o index.html.
 * O dashboard agora é renderizado pelo React (SPA), e os dados são fornecidos via /api/dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<Project> projects = projectService.findAllByUser(currentUser);
        List<Task> myTasks = taskService.findActiveTasks(currentUser);

        long totalProjects = projects.size();
        long activeProjects = projects.stream().filter(p -> "ACTIVE".equals(p.getStatus())).count();
        long totalTasks = myTasks.size();
        long overdueTasks = myTasks.stream().filter(Task::isOverdue).count();

        Map<String, Object> data = new HashMap<>();
        data.put("totalProjects", totalProjects);
        data.put("activeProjects", activeProjects);
        data.put("totalTasks", totalTasks);
        data.put("overdueTasks", overdueTasks);
        data.put("projects", projects.stream().limit(6).toList());
        data.put("myTasks", myTasks.stream().limit(8).toList());

        return ResponseEntity.ok(data);
    }
}
