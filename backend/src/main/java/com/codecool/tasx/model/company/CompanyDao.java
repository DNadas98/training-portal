package com.codecool.tasx.model.company;

import com.codecool.tasx.model.request.RequestStatus;
import com.codecool.tasx.model.user.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyDao extends JpaRepository<Company, Long> {

  //https://www.baeldung.com/spring-data-jpa-query

  @Query("SELECT c FROM Company c WHERE :applicationUser MEMBER OF c.employees")
  List<Company> findAllWithEmployee(@Param("applicationUser") ApplicationUser applicationUser);

  @Query(
    "SELECT c FROM Company c WHERE :applicationUser NOT MEMBER OF c.employees AND c.id NOT IN " +
      "(SELECT cr.company.id FROM CompanyJoinRequest cr " +
      "WHERE cr.applicationUser = :applicationUser AND cr.status IN (:statuses))")
  List<Company> findAllWithoutEmployeeAndJoinRequest(
    @Param("applicationUser") ApplicationUser applicationUser,
    @Param("statuses") List<RequestStatus> statuses);
}
