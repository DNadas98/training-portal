package com.codecool.training_portal.dto.group.project.task.expense;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.Length;

public record ExpenseResponseDto(
  @NotNull @Min(1) Long expenseId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Positive Double price,
  @NotNull Boolean paid) {
}
