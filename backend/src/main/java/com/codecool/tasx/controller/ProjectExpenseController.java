package com.codecool.tasx.controller;

import com.codecool.tasx.service.company.project.task.expense.ExpenseService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/expenses")
@RequiredArgsConstructor
public class ProjectExpenseController {
  private final ExpenseService expenseService;

  @GetMapping("/sum")
  public ResponseEntity<?> sumExpensesOfTask(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "paid", required = false) Boolean paid) {
    Double sum;
    if (paid == null) {
      sum = expenseService.sumAllExpensesInProject(companyId, projectId);
    } else if (paid) {
      sum = expenseService.sumPaidExpensesInProject(companyId, projectId);
    } else {
      sum = expenseService.sumUnpaidExpensesInProject(companyId, projectId);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", sum));
  }
}
