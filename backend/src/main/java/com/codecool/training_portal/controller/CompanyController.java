package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.company.CompanyCreateRequestDto;
import com.codecool.training_portal.dto.company.CompanyResponsePrivateDTO;
import com.codecool.training_portal.dto.company.CompanyResponsePublicDTO;
import com.codecool.training_portal.dto.company.CompanyUpdateRequestDto;
import com.codecool.training_portal.service.company.CompanyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {
  private final CompanyService companyService;

  @GetMapping()
  public ResponseEntity<?> getAllCompanies(
    @RequestParam(name = "withUser") Boolean withUser) {
    List<@Valid CompanyResponsePublicDTO> companies;
    if (withUser) {
      companies = companyService.getCompaniesWithUser();
    } else {
      companies = companyService.getCompaniesWithoutUser();
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", companies));
  }

  @GetMapping("/{companyId}")
  public ResponseEntity<?> getCompanyById(@PathVariable @Min(1) Long companyId) {
    CompanyResponsePrivateDTO company = companyService.getCompanyById(companyId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", company));
  }

  @PostMapping
  public ResponseEntity<?> createCompany(
    @RequestBody @Valid CompanyCreateRequestDto createRequestDto) {
    CompanyResponsePrivateDTO companyResponseDetails = companyService.createCompany(
      createRequestDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Company created successfully", "data", companyResponseDetails));
  }

  @PutMapping("/{companyId}")
  public ResponseEntity<?> updateCompany(
    @PathVariable @Min(1) Long companyId,
    @RequestBody @Valid CompanyUpdateRequestDto updateRequestDto) {
    CompanyResponsePrivateDTO companyResponseDetails = companyService.updateCompany(
      updateRequestDto, companyId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Company with ID " + companyId + " updated successfully", "data",
        companyResponseDetails));
  }

  @DeleteMapping("/{companyId}")
  public ResponseEntity<?> deleteCompany(@PathVariable @Min(1) Long companyId) {
    companyService.deleteCompany(companyId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Company with ID " + companyId + " deleted successfully"));
  }
}