package com.vedataworkhub.domain.task.model;

import jakarta.persistence.*;
import lombok.*;import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.user.model.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TaskStatus status = TaskStatus.BACKLOG;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(nullable = false)
    @Builder.Default
    private Integer progress = 0;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(nullable = false)
    @Builder.Default
    private Integer position = 0;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TaskComment> comments = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate) && status != TaskStatus.DONE;
    }

    public enum TaskStatus {
        BACKLOG("Backlog", "secondary"),
        DESIGN("Design", "purple"),
        TODO("A Fazer", "info"),
        IN_PROGRESS("Em Andamento", "warning"),
        CODE_REVIEW("Revisão de Código", "primary"),
        TESTING("Fase de Teste", "orange"),
        DONE("Concluído", "success");

        private final String label;
        private final String color;

        TaskStatus(String label, String color) {
            this.label = label;
            this.color = color;
        }

        public String getLabel() { return label; }
        public String getColor() { return color; }
    }

    public enum TaskPriority {
        LOW("Baixa", "success"),
        MEDIUM("Média", "info"),
        HIGH("Alta", "warning"),
        CRITICAL("Crítica", "danger");

        private final String label;
        private final String color;

        TaskPriority(String label, String color) {
            this.label = label;
            this.color = color;
        }

        public String getLabel() { return label; }
        public String getColor() { return color; }
    }
}
