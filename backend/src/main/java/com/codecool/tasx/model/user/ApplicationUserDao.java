package com.codecool.tasx.model.user;

import com.codecool.tasx.model.auth.account.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationUserDao extends JpaRepository<ApplicationUser, Long> {
  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.adminCompanies WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAdminCompanies(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.editorCompanies WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchEditorCompanies(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.employeeCompanies WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchEmployeeCompanies(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.adminProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAdminProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.editorProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchEditorProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.assignedProjects WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAssignedProjects(@Param("id") Long id);

  @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.assignedTasks WHERE u.id = :id")
  Optional<ApplicationUser> findByIdAndFetchAssignedTasks(@Param("id") Long id);
}
