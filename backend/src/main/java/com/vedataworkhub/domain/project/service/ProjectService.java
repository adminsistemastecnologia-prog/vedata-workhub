package com.vedataworkhub.domain.project.service;

import com.vedataworkhub.domain.project.dto.ProjectDto;
import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.project.repository.ProjectRepository;
import com.vedataworkhub.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project create(ProjectDto dto, User owner) {
        Project project = Project.builder()
            .name(dto.getName())
            .description(dto.getDescription())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .color(dto.getColor() != null ? dto.getColor() : "#6366f1")
            .status("ACTIVE")
            .owner(owner)
            .build();

        project.getMembers().add(owner);
        return projectRepository.save(project);
    }

    public Project update(Long id, ProjectDto dto, User currentUser) {
        Project project = findByIdAndCheckAccess(id, currentUser);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        if (dto.getColor() != null) project.setColor(dto.getColor());
        return projectRepository.save(project);
    }

    public void delete(Long id, User currentUser) {
        Project project = findByIdAndCheckAccess(id, currentUser);
        projectRepository.delete(project);
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> findAllByUser(User user) {
        if (user.getRole() == User.Role.ADMIN) {
            return projectRepository.findAll();
        }
        return projectRepository.findAllByUser(user);
    }

    public Project addMember(Long projectId, Long userId, User currentUser) {
        Project project = findByIdAndCheckAccess(projectId, currentUser);
        User newMember = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        project.getMembers().add(newMember);
        return projectRepository.save(project);
    }

    public Project removeMember(Long projectId, Long userId, User currentUser) {
        Project project = findByIdAndCheckAccess(projectId, currentUser);
        if (project.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Não é possível remover o dono do projeto");
        }
        userRepository.findById(userId).ifPresent(u -> project.getMembers().remove(u));
        return projectRepository.save(project);
    }

    public Project updateStatus(Long id, String status, User currentUser) {
        Project project = findByIdAndCheckAccess(id, currentUser);
        project.setStatus(status);
        return projectRepository.save(project);
    }

    private Project findByIdAndCheckAccess(Long id, User user) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        if (user.getRole() != User.Role.ADMIN && !project.isMember(user)) {
            throw new RuntimeException("Acesso negado ao projeto");
        }
        return project;
    }
}
