package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.company.CompanyResponsePrivateDTO;
import com.codecool.training_portal.dto.company.CompanyResponsePublicDTO;
import com.codecool.training_portal.dto.requests.CompanyJoinRequestResponseDto;
import com.codecool.training_portal.model.company.Company;
import com.codecool.training_portal.model.request.CompanyJoinRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CompanyConverter {
  private final UserConverter userConverter;

  public List<CompanyResponsePublicDTO> getCompanyResponsePublicDtos(List<Company> companies) {
    return companies.stream().map(
      company -> getCompanyResponsePublicDto(company)).collect(Collectors.toList());
  }

  public CompanyResponsePrivateDTO getCompanyResponsePrivateDto(Company company) {
    return new CompanyResponsePrivateDTO(company.getId(), company.getName(),
      company.getDescription());
  }

  public CompanyResponsePublicDTO getCompanyResponsePublicDto(Company company) {
    return new CompanyResponsePublicDTO(company.getId(), company.getName(),
      company.getDescription());
  }

  public CompanyJoinRequestResponseDto getCompanyJoinRequestResponseDto(
    CompanyJoinRequest request) {
    return new CompanyJoinRequestResponseDto(request.getId(),
      getCompanyResponsePublicDto(request.getCompany()),
      userConverter.getUserResponsePublicDto(request.getApplicationUser()), request.getStatus());
  }

  public List<CompanyJoinRequestResponseDto> getCompanyJoinRequestResponseDtos(
    List<CompanyJoinRequest> requests) {
    return requests.stream().map(request -> getCompanyJoinRequestResponseDto(request)).collect(
      Collectors.toList());
  }
}
