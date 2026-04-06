package com.vedataworkhub.domain.project.model;

import jakarta.persistence.*;
import lombok.*;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.task.model.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(length = 7)
    @Builder.Default
    private String color = "#6366f1";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "project_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

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

    public int getTaskCount() {
        return tasks != null ? tasks.size() : 0;
    }

    public int getCompletedTaskCount() {
        if (tasks == null) return 0;
        return (int) tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.DONE).count();
    }

    public int getProgressPercentage() {
        int total = getTaskCount();
        if (total == 0) return 0;
        return (int) ((double) getCompletedTaskCount() / total * 100);
    }

    public boolean isMember(User user) {
        return members.contains(user) || (owner != null && owner.getId().equals(user.getId()));
    }
}
