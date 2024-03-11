package com.codecool.training_portal.model.request;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyJoinRequestDao extends JpaRepository<CompanyJoinRequest, Long> {
  @Query(
    "SELECT cjr FROM CompanyJoinRequest cjr WHERE cjr.id = :id AND cjr.company.id = :companyId")
  Optional<CompanyJoinRequest> findByIdAndCompanyId(Long id, Long companyId);

  List<CompanyJoinRequest> findByCompanyAndStatus(Company company, RequestStatus status);

  Optional<CompanyJoinRequest> findOneByCompanyAndApplicationUser(
    Company company, ApplicationUser applicationUser);

  Optional<CompanyJoinRequest> findByIdAndApplicationUser(Long id, ApplicationUser applicationUser);

  List<CompanyJoinRequest> findByApplicationUser(ApplicationUser applicationUser);

  @Override
  @Transactional
  @Modifying
  @Query("delete from CompanyJoinRequest c where c.id = :id")
  void deleteById(Long id);
}
