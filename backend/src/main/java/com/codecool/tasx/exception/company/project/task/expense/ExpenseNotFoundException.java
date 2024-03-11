package com.codecool.tasx.exception.company.project.task.expense;

public class ExpenseNotFoundException extends RuntimeException {
  public ExpenseNotFoundException() {
    super("Expense not found");
  }
}
