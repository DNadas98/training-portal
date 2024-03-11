package com.codecool.training_portal.exception.group.project.task.expense;

public class ExpenseNotFoundException extends RuntimeException {
  public ExpenseNotFoundException() {
    super("Expense not found");
  }
}
