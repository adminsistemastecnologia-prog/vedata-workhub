package com.vedataworkhub.domain.project.repository;

import com.vedataworkhub.domain.project.model.Project;
import com.vedataworkhub.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User owner);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner = :user OR m = :user ORDER BY p.createdAt DESC")
    List<Project> findAllByUser(@Param("user") User user);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner = :user OR m = :user")
    List<Project> findProjectsByUserMembership(@Param("user") User user);
}
