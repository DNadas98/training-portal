package net.dnadas.training_portal.model.request;

import jakarta.persistence.OrderBy;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.group.project.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

  @Query(
    "SELECT pjr FROM ProjectJoinRequest pjr" +
      " WHERE pjr.project.userGroup.id = :groupId" +
      " AND pjr.project.id = :projectId" +
      " AND pjr.status = :status" +
      " AND (LOWER(pjr.applicationUser.username) LIKE %:search%)" +
      " ORDER BY pjr.createdAt DESC")
  Page<ProjectJoinRequest> findByProjectAndStatus(
    Long groupId, Long projectId, RequestStatus status, String search, Pageable pageable);

  Optional<ProjectJoinRequest> findOneByProjectAndApplicationUser(
    Project project, ApplicationUser applicationUser);

  Optional<ProjectJoinRequest> findByIdAndApplicationUser(Long id, ApplicationUser applicationUser);

  @OrderBy("createdAt DESC")
  List<ProjectJoinRequest> findByApplicationUser(ApplicationUser applicationUser);
}
