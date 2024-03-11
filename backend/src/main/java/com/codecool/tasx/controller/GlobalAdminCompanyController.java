package com.codecool.tasx.controller;

import com.codecool.tasx.dto.company.CompanyResponsePublicDTO;
import com.codecool.tasx.service.company.CompanyService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/admin/companies")
@RequiredArgsConstructor
public class GlobalAdminCompanyController {
  private final CompanyService companyService;

  @GetMapping
  public ResponseEntity<?> getAllCompanies() {
    List<CompanyResponsePublicDTO> companies = companyService.getAllCompanies();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", companies));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteCompanyById(@PathVariable @Min(1) Long id) {
    companyService.deleteCompany(id);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Company with ID " + id + " deleted successfully"));
  }
}
