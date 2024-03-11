package com.codecool.tasx.dto.company;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record CompanyResponsePrivateDTO(
  @NotNull @Min(1) Long companyId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 500) String description
) {
}
