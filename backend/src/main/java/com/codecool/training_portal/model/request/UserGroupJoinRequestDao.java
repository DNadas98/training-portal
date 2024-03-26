package com.codecool.training_portal.model.request;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.UserGroup;
import jakarta.persistence.OrderBy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGroupJoinRequestDao extends JpaRepository<UserGroupJoinRequest, Long> {
  @Query(
    "SELECT ugjr FROM UserGroupJoinRequest ugjr " +
      "WHERE ugjr.id = :id " +
      "AND ugjr.userGroup.id = :groupId")
  Optional<UserGroupJoinRequest> findByIdAndGroupId(Long id, Long groupId);

  @OrderBy("createdAt DESC")
  List<UserGroupJoinRequest> findByUserGroupAndStatus(UserGroup userGroup, RequestStatus status);

  Optional<UserGroupJoinRequest> findOneByUserGroupAndApplicationUser(
    UserGroup userGroup, ApplicationUser applicationUser);

  Optional<UserGroupJoinRequest> findByIdAndApplicationUser(
    Long id, ApplicationUser applicationUser);

  @OrderBy("createdAt DESC")
  List<UserGroupJoinRequest> findByApplicationUser(ApplicationUser applicationUser);

  @Override
  @Transactional
  @Modifying
  @Query("delete from UserGroupJoinRequest ugjr where ugjr.id = :id")
  void deleteById(@Param("id") Long id);
}
