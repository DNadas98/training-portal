package com.codecool.tasx.dto.company.project.task.expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.Length;

public record ExpenseUpdateRequestDto(
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Positive Double price, @NotNull Boolean paid) {
}
