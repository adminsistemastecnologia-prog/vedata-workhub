package com.vedataworkhub.domain.task.dto;

import com.vedataworkhub.domain.task.model.Task;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskDto {

    @NotBlank(message = "Título da tarefa é obrigatório")
    @Size(max = 200)
    private String title;

    private String description;

    private Task.TaskStatus status;

    private Task.TaskPriority priority;

    @Min(0) @Max(100)
    private Integer progress;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dueDate;

    @NotNull(message = "Projeto é obrigatório")
    private Long projectId;

    private Long assigneeId;
}
