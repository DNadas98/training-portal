package net.dnadas.training_portal.model.group.project;

import net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.request.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

  @Query(
    "SELECT new net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto(" +
      "u.id, u.username, " +
      "CASE WHEN u MEMBER OF p.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.coordinators THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.editors THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.editors THEN TRUE ELSE FALSE END) " +
      "FROM Project p " +
      "JOIN p.userGroup g " +
      "JOIN p.assignedMembers u " +
      "WHERE p.id = :projectId AND g.id = :groupId " +
      "AND LOWER(u.username) LIKE %:search% " +
      "ORDER BY u.username ASC")
  Page<UserResponseWithProjectAndGroupPermissionsInternalDto> findMembersWithPermissionsByProjectIdAndGroupIdAndSearch(
    @Param("projectId") Long projectId,
    @Param("groupId") Long groupId,
    @Param("search") String search,
    Pageable pageable);

  @Query(
    "SELECT new net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto(" +
      "u.id, u.username, " +
      "CASE WHEN u MEMBER OF p.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.coordinators THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.editors THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.editors THEN TRUE ELSE FALSE END) " +
      "FROM Project p " +
      "JOIN p.userGroup g " +
      "JOIN p.editors u " +
      "WHERE p.id = :projectId AND g.id = :groupId " +
      "AND LOWER(u.username) LIKE %:search% " +
      "ORDER BY u.username ASC")
  Page<UserResponseWithProjectAndGroupPermissionsInternalDto> findEditorsWithPermissionsByProjectIdAndGroupIdAndSearch(
    @Param("projectId") Long projectId,
    @Param("groupId") Long groupId,
    @Param("search") String search,
    Pageable pageable);

  @Query(
    "SELECT new net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto(" +
      "u.id, u.username, " +
      "CASE WHEN u MEMBER OF p.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.coordinators THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.editors THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.editors THEN TRUE ELSE FALSE END) " +
      "FROM Project p " +
      "JOIN p.userGroup g " +
      "JOIN p.admins u " +
      "WHERE p.id = :projectId AND g.id = :groupId " +
      "AND LOWER(u.username) LIKE %:search% " +
      "ORDER BY u.username ASC")
  Page<UserResponseWithProjectAndGroupPermissionsInternalDto> findAdminsWithPermissionsByProjectIdAndGroupIdAndSearch(
    @Param("projectId") Long projectId,
    @Param("groupId") Long groupId,
    @Param("search") String search,
    Pageable pageable);

  @Query(
    "SELECT new net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto(" +
      "u.id, u.username, " +
      "CASE WHEN u MEMBER OF p.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.coordinators THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF p.editors THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.admins THEN TRUE ELSE FALSE END, " +
      "CASE WHEN u MEMBER OF g.editors THEN TRUE ELSE FALSE END) " +
      "FROM Project p " +
      "JOIN p.userGroup g " +
      "JOIN p.coordinators u " +
      "WHERE p.id = :projectId AND g.id = :groupId " +
      "AND LOWER(u.username) LIKE %:search% " +
      "ORDER BY u.username ASC")
  Page<UserResponseWithProjectAndGroupPermissionsInternalDto> findCoordinatorsWithPermissionsByProjectIdAndGroupIdAndSearch(
    @Param("projectId") Long projectId,
    @Param("groupId") Long groupId,
    @Param("search") String search,
    Pageable pageable);

  List<Project> findAllByUserGroup(UserGroup userGroup);
}
