package com.codecool.tasx.service.company;

import com.codecool.tasx.dto.company.CompanyCreateRequestDto;
import com.codecool.tasx.dto.company.CompanyResponsePrivateDTO;
import com.codecool.tasx.dto.company.CompanyResponsePublicDTO;
import com.codecool.tasx.dto.company.CompanyUpdateRequestDto;
import com.codecool.tasx.exception.auth.UnauthorizedException;
import com.codecool.tasx.exception.company.CompanyNotFoundException;
import com.codecool.tasx.model.company.Company;
import com.codecool.tasx.model.company.CompanyDao;
import com.codecool.tasx.model.request.RequestStatus;
import com.codecool.tasx.model.user.ApplicationUser;
import com.codecool.tasx.service.auth.UserProvider;
import com.codecool.tasx.service.converter.CompanyConverter;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
  private final CompanyDao companyDao;
  private final CompanyConverter companyConverter;
  private final UserProvider userProvider;

  public List<CompanyResponsePublicDTO> getAllCompanies() throws UnauthorizedException {
    List<Company> companies = companyDao.findAll();
    return companyConverter.getCompanyResponsePublicDtos(companies);
  }

  @Transactional(readOnly = true)
  public List<CompanyResponsePublicDTO> getCompaniesWithoutUser() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    List<Company> companies = companyDao.findAllWithoutEmployeeAndJoinRequest(
      applicationUser, List.of(RequestStatus.PENDING, RequestStatus.DECLINED));
    return companyConverter.getCompanyResponsePublicDtos(companies);
  }

  @Transactional(readOnly = true)
  public List<CompanyResponsePublicDTO> getCompaniesWithUser() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Hibernate.initialize(applicationUser.getEmployeeCompanies());
    List<Company> companies = applicationUser.getEmployeeCompanies().stream().toList();
    return companyConverter.getCompanyResponsePublicDtos(companies);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_EMPLOYEE')")
  public CompanyResponsePrivateDTO getCompanyById(Long companyId)
    throws CompanyNotFoundException, UnauthorizedException {
    Company company = companyDao.findById(companyId).orElseThrow(
      () -> new CompanyNotFoundException(companyId));
    return companyConverter.getCompanyResponsePrivateDto(company);
  }

  @Transactional(rollbackFor = Exception.class)
  public CompanyResponsePrivateDTO createCompany(
    CompanyCreateRequestDto createRequestDto) throws ConstraintViolationException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Company company = new Company(
      createRequestDto.name(), createRequestDto.description(), applicationUser);
    company.addEmployee(applicationUser);
    companyDao.save(company);
    return companyConverter.getCompanyResponsePrivateDto(company);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_EDITOR')")
  public CompanyResponsePrivateDTO updateCompany(
    CompanyUpdateRequestDto updateRequestDto, Long companyId) throws ConstraintViolationException {
    Company company = companyDao.findById(companyId).orElseThrow(
      () -> new CompanyNotFoundException(companyId));
    company.setName(updateRequestDto.name());
    company.setDescription(updateRequestDto.description());
    Company updatedCompany = companyDao.save(company);
    return companyConverter.getCompanyResponsePrivateDto(updatedCompany);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_ADMIN')")
  public void deleteCompany(Long companyId) {
    Company company = companyDao.findById(companyId).orElseThrow(() ->
      new CompanyNotFoundException(companyId));
    companyDao.delete(company);
  }
}
