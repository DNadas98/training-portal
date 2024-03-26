package com.codecool.training_portal.model.group.project;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.request.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectDao extends JpaRepository<Project, Long> {
  @Query(
    "SELECT p FROM Project p WHERE p.id = :projectId" +
      " AND p.userGroup.id = :groupId")
  Optional<Project> findByIdAndGroupId(
    @Param("projectId") Long projectId, @Param("groupId") Long groupId);

  @Query(
    "SELECT p FROM Project p" +
      " WHERE :applicationUser MEMBER OF p.assignedMembers" +
      " AND p.userGroup = :userGroup " +
      "ORDER BY p.startDate DESC")
  List<Project> findAllWithMemberAndGroup(
    @Param("applicationUser") ApplicationUser applicationUser, @Param(
    "userGroup") UserGroup userGroup);

  @Query(
    "SELECT p FROM Project p" +
      " WHERE :applicationUser NOT MEMBER OF p.assignedMembers" +
      " AND p.id NOT IN " +
      "(SELECT pr.project.id FROM ProjectJoinRequest pr" +
      " WHERE pr.applicationUser = :applicationUser" +
      " AND pr.status IN (:statuses))" +
      " AND p.userGroup = :userGroup " +
      "ORDER BY p.startDate DESC")
  List<Project> findAllWithoutMemberAndJoinRequestInGroup(
    @Param("applicationUser") ApplicationUser applicationUser,
    @Param("statuses") List<RequestStatus> statuses,
    @Param("userGroup") UserGroup userGroup);
}
