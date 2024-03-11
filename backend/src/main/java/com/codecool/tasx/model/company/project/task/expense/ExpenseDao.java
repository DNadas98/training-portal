package com.codecool.tasx.model.company.project.task.expense;

import com.codecool.tasx.model.company.project.Project;
import com.codecool.tasx.model.company.project.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpenseDao extends JpaRepository<Expense, Long> {
  @Query(
    "SELECT e FROM Expense e WHERE e.task.project.company.id = :companyId" +
      " AND e.task.project.id = :projectId" +
      " AND e.task.id = :taskId" +
      " AND e.id = :expenseId")
  Optional<Expense> findByCompanyIdAndProjectIdAndTaskIdAndExpenseId(
    @Param("companyId") Long companyId,
    @Param("projectId") Long projectId,
    @Param("taskId") Long taskId,
    @Param("expenseId") Long expenseId);

  @Query("SELECT SUM(e.price) FROM Expense e WHERE e.task.project = :project")
  Optional<Double> sumAllExpensesInProject(@Param("project") Project project);

  @Query(
    "SELECT SUM(e.price) FROM Expense e WHERE e.task.project = :project AND e.paid = false")
  Optional<Double> sumUnpaidExpensesInProject(@Param("project") Project project);

  @Query(
    "SELECT SUM(e.price) FROM Expense e WHERE e.task.project = :project AND e.paid = true")
  Optional<Double> sumPaidExpensesInProject(@Param("project") Project project);

  @Query("SELECT SUM(e.price) FROM Expense e WHERE e.task = :task")
  Optional<Double> sumAllExpensesInTask(@Param("task") Task task);

  @Query("SELECT SUM(e.price) FROM Expense e WHERE e.task = :task AND e.paid = false")
  Optional<Double> sumUnpaidExpensesInTask(@Param("task") Task task);

  @Query("SELECT SUM(e.price) FROM Expense e WHERE e.task = :task AND e.paid = true")
  Optional<Double> sumPaidExpensesInTask(@Param("task") Task task);
}
