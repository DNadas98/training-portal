package com.codecool.training_portal.model.company.project;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.company.Company;
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
      " AND p.company.id = :companyId")
  Optional<Project> findByIdAndCompanyId(
    @Param("projectId") Long projectId, @Param("companyId") Long companyId);

  @Query(
    "SELECT p FROM Project p" +
      " WHERE :applicationUser MEMBER OF p.assignedEmployees" +
      " AND p.company = :company")
  List<Project> findAllWithEmployeeAndCompany(
    @Param("applicationUser") ApplicationUser applicationUser, @Param("company") Company company);

  @Query(
    "SELECT p FROM Project p" +
      " WHERE :applicationUser NOT MEMBER OF p.assignedEmployees" +
      " AND p.id NOT IN " +
      "(SELECT pr.project.id FROM ProjectJoinRequest pr" +
      " WHERE pr.applicationUser = :applicationUser" +
      " AND pr.status IN (:statuses))" +
      " AND p.company = :company")
  List<Project> findAllWithoutEmployeeAndJoinRequestInCompany(
    @Param("applicationUser") ApplicationUser applicationUser,
    @Param("statuses") List<RequestStatus> statuses,
    @Param("company") Company company);
}
