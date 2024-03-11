package com.codecool.training_portal.model.request;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectJoinRequestDao extends JpaRepository<ProjectJoinRequest, Long> {
  @Query(
    "SELECT pjr FROM ProjectJoinRequest pjr" +
            " WHERE pjr.project.userGroup.id = :groupId" +
      " AND pjr.project.id = :projectId" +
      " AND pjr.id = :requestId")
  Optional<ProjectJoinRequest> findByGroupIdAndProjectIdAndRequestId(
          Long groupId, Long projectId, Long requestId);

  List<ProjectJoinRequest> findByProjectAndStatus(Project project, RequestStatus status);

  Optional<ProjectJoinRequest> findOneByProjectAndApplicationUser(
    Project project, ApplicationUser applicationUser);

  Optional<ProjectJoinRequest> findByIdAndApplicationUser(Long id, ApplicationUser applicationUser);

  List<ProjectJoinRequest> findByApplicationUser(ApplicationUser applicationUser);
}
