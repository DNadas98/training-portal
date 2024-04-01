package net.dnadas.training_portal.model.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationUserDao extends JpaRepository<ApplicationUser, Long> {
  Optional<ApplicationUser> findByEmail(String email);

  Optional<ApplicationUser> findByGlobalRolesContaining(GlobalRole globalRole);

  @Query("SELECT u FROM ApplicationUser u WHERE u.email = :email OR u. username = :username")
  Optional<ApplicationUser> findByEmailOrUsername(
    @Param("email") String email, @Param("username") String username);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.adminUserGroups WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAdminGroups(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.editorUserGroups WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchEditorGroups(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.memberUserGroups WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchMemberGroups(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.adminProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAdminProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.editorProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchEditorProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.assignedProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAssignedProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u LEFT JOIN FETCH u.assignedTasks WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAssignedTasks(@Param("id") Long id);

  Optional<ApplicationUser> findByUsername(String username);
}
