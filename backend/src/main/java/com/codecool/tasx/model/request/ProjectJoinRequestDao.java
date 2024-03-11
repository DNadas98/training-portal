package com.codecool.tasx.model.request;

import com.codecool.tasx.model.company.project.Project;
import com.codecool.tasx.model.user.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectJoinRequestDao extends JpaRepository<ProjectJoinRequest, Long> {
  @Query(
    "SELECT pjr FROM ProjectJoinRequest pjr" +
      " WHERE pjr.project.company.id = :companyId" +
      " AND pjr.project.id = :projectId" +
      " AND pjr.id = :requestId")
  Optional<ProjectJoinRequest> findByCompanyIdAndProjectIdAndRequestId(
    Long companyId, Long projectId, Long requestId);

  List<ProjectJoinRequest> findByProjectAndStatus(Project project, RequestStatus status);

  Optional<ProjectJoinRequest> findOneByProjectAndApplicationUser(
    Project project, ApplicationUser applicationUser);

  Optional<ProjectJoinRequest> findByIdAndApplicationUser(Long id, ApplicationUser applicationUser);

  List<ProjectJoinRequest> findByApplicationUser(ApplicationUser applicationUser);
}
