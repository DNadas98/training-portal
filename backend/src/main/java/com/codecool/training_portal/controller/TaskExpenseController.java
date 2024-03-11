package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.task.expense.ExpenseCreateRequestDto;
import com.codecool.training_portal.dto.group.project.task.expense.ExpenseResponseDto;
import com.codecool.training_portal.dto.group.project.task.expense.ExpenseUpdateRequestDto;
import com.codecool.training_portal.service.group.project.task.expense.ExpenseService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/tasks/{taskId}/expenses")
@RequiredArgsConstructor
public class TaskExpenseController {
  private final ExpenseService expenseService;

  @GetMapping
  public ResponseEntity<?> getAllExpensesOfTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
      List<ExpenseResponseDto> expenses = expenseService.getAllExpenses(groupId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", expenses));
  }

  @GetMapping("/sum")
  public ResponseEntity<?> sumExpensesOfTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId,
    @RequestParam(name = "paid", required = false) Boolean paid) {
    Double sum;
    if (paid == null) {
        sum = expenseService.sumAllExpensesInTask(groupId, projectId, taskId);
    } else if (paid) {
        sum = expenseService.sumPaidExpensesInTask(groupId, projectId, taskId);
    } else {
        sum = expenseService.sumUnpaidExpensesInTask(groupId, projectId, taskId);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", sum));
  }

  @GetMapping("/{expenseId}")
  public ResponseEntity<?> getExpenseById(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, @PathVariable @Min(1) Long expenseId) {
      ExpenseResponseDto expense = expenseService.getExpense(groupId, projectId, taskId, expenseId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", expense));
  }

  @PostMapping
  public ResponseEntity<?> createExpense(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId,
    @RequestBody @Valid ExpenseCreateRequestDto createRequestDto) {
      ExpenseResponseDto expense = expenseService.createExpense(createRequestDto, groupId,
      projectId, taskId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Expense created successfully", "data", expense));
  }

  @PutMapping("/{expenseId}")
  public ResponseEntity<?> updateExpense(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, @PathVariable @Min(1) Long expenseId,
    @RequestBody @Valid ExpenseUpdateRequestDto updateRequestDto) {
      ExpenseResponseDto expense = expenseService.updateExpense(updateRequestDto, groupId,
      projectId, taskId, expenseId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Expense with ID " + expenseId + " updated successfully", "data", expense));
  }

  @DeleteMapping("/{expenseId}")
  public ResponseEntity<?> deleteExpense(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, @PathVariable @Min(1) Long expenseId) {
      expenseService.deleteExpense(groupId, projectId, taskId, expenseId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Expense with ID " + expenseId + " deleted successfully"));
  }
}
