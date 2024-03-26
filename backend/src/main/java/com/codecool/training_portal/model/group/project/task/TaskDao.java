package com.codecool.training_portal.model.group.project.task;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskDao extends JpaRepository<Task, Long> {
  @Query(
    "SELECT t FROM Task t WHERE t.project.userGroup.id = :groupId" +
      " AND t.project.id = :projectId" +
      " AND t.id = :taskId")
  Optional<Task> findByGroupIdAndProjectIdAndTaskId(
    @Param("groupId") Long groupId,
    @Param("projectId") Long projectId,
    @Param("taskId") Long taskId);

  @Query(
    "SELECT t FROM Task t" +
      " WHERE t.project = :project" +
      " AND :user MEMBER OF t.assignedMembers " +
      "ORDER BY t.startDate ASC"
  )
  List<Task> findAllByProjectAndApplicationUser(Project project, ApplicationUser user);

  @Query(
    "SELECT t FROM Task t" +
      " WHERE t.project = :project" +
      " AND :user NOT MEMBER OF t.assignedMembers " +
      "ORDER BY t.startDate ASC"
  )
  List<Task> findAllByProjectAndWithoutApplicationUser(Project project, ApplicationUser user);

  @Query(
    "SELECT t FROM Task t" +
      " WHERE t.project = :project" +
      " AND t.taskStatus = :taskStatus" +
      " AND :user MEMBER OF t.assignedMembers " +
      "ORDER BY t.startDate ASC"
  )
  List<Task> findAllByProjectAndTaskStatusAndApplicationUser(
    Project project, TaskStatus taskStatus, ApplicationUser user);

  @Query(
    "SELECT t FROM Task t" +
      " WHERE t.project = :project" +
      " AND t.taskStatus = :taskStatus" +
      " AND :user NOT MEMBER OF t.assignedMembers " +
      "ORDER BY t.startDate ASC"
  )
  List<Task> findAllByProjectAndTaskStatusAndWithoutApplicationUser(
    Project project, TaskStatus taskStatus, ApplicationUser user);
}
