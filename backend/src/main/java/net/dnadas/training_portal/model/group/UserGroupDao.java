package net.dnadas.training_portal.model.group;

import net.dnadas.training_portal.model.request.RequestStatus;
import net.dnadas.training_portal.model.user.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupDao extends JpaRepository<UserGroup, Long> {
  @Query(
    "SELECT ug FROM UserGroup ug WHERE :applicationUser NOT MEMBER OF ug.members AND ug.id NOT IN " +
      "(SELECT ugjr.userGroup.id FROM UserGroupJoinRequest ugjr " +
      "WHERE ugjr.applicationUser = :applicationUser AND ugjr.status IN (:statuses)) " +
      "ORDER BY ug.name ASC")
  List<UserGroup> findAllWithoutMemberAndJoinRequest(
    @Param("applicationUser") ApplicationUser applicationUser,
    @Param("statuses") List<RequestStatus> statuses);
}
