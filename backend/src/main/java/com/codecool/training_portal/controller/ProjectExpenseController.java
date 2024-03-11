package com.codecool.training_portal.controller;

import com.codecool.training_portal.service.group.project.task.expense.ExpenseService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/expenses")
@RequiredArgsConstructor
public class ProjectExpenseController {
  private final ExpenseService expenseService;

  @GetMapping("/sum")
  public ResponseEntity<?> sumExpensesOfTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "paid", required = false) Boolean paid) {
    Double sum;
    if (paid == null) {
        sum = expenseService.sumAllExpensesInProject(groupId, projectId);
    } else if (paid) {
        sum = expenseService.sumPaidExpensesInProject(groupId, projectId);
    } else {
        sum = expenseService.sumUnpaidExpensesInProject(groupId, projectId);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", sum));
  }
}
