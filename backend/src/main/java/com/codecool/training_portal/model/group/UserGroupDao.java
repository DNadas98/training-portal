package com.codecool.training_portal.model.group;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.request.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupDao extends JpaRepository<UserGroup, Long> {
    @Query("SELECT ug FROM UserGroup ug WHERE :applicationUser MEMBER OF ug.members")
    List<UserGroup> findAllWithMember(@Param("applicationUser") ApplicationUser applicationUser);

    @Query(
            "SELECT ug FROM UserGroup ug WHERE :applicationUser NOT MEMBER OF ug.members AND ug.id NOT IN " +
                    "(SELECT ugjr.userGroup.id FROM UserGroupJoinRequest ugjr " +
                    "WHERE ugjr.applicationUser = :applicationUser AND ugjr.status IN (:statuses))")
    List<UserGroup> findAllWithoutMemberAndJoinRequest(
            @Param("applicationUser") ApplicationUser applicationUser,
            @Param("statuses") List<RequestStatus> statuses);
}
