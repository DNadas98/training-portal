package com.codecool.training_portal.service.company.project.task.expense;

import com.codecool.training_portal.dto.company.project.task.expense.ExpenseCreateRequestDto;
import com.codecool.training_portal.dto.company.project.task.expense.ExpenseResponseDto;
import com.codecool.training_portal.dto.company.project.task.expense.ExpenseUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.company.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.company.project.task.TaskNotFoundException;
import com.codecool.training_portal.exception.company.project.task.expense.ExpenseNotFoundException;
import com.codecool.training_portal.model.company.project.Project;
import com.codecool.training_portal.model.company.project.ProjectDao;
import com.codecool.training_portal.model.company.project.task.Task;
import com.codecool.training_portal.model.company.project.task.TaskDao;
import com.codecool.training_portal.model.company.project.task.expense.Expense;
import com.codecool.training_portal.model.company.project.task.expense.ExpenseDao;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
  private final TaskDao taskDao;
  private final ProjectDao projectDao;
  private final ExpenseDao expenseDao;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public List<ExpenseResponseDto> getAllExpenses(Long companyId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
    Task task = getTask(companyId, projectId, taskId);
    Set<Expense> expenses = task.getExpenses();
    return expenses.stream().map(
      expense -> new ExpenseResponseDto(expense.getId(), expense.getName(), expense.getPrice(),
        expense.isPaid())).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public Double sumAllExpensesInTask(Long companyId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
    Task task = getTask(companyId, projectId, taskId);
    return expenseDao.sumAllExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public Double sumUnpaidExpensesInTask(Long companyId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
    Task task = getTask(companyId, projectId, taskId);
    return expenseDao.sumUnpaidExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public Double sumPaidExpensesInTask(Long companyId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
    Task task = getTask(companyId, projectId, taskId);
    return expenseDao.sumPaidExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public Double sumAllExpensesInProject(Long companyId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
    Project project = getProject(companyId, projectId);
    return expenseDao.sumAllExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public Double sumUnpaidExpensesInProject(Long companyId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
    Project project = getProject(companyId, projectId);
    return expenseDao.sumUnpaidExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public Double sumPaidExpensesInProject(Long companyId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
    Project project = getProject(companyId, projectId);
    return expenseDao.sumPaidExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public ExpenseResponseDto getExpense(
    Long companyId, Long projectId, Long taskId, Long expenseId) throws UnauthorizedException {
    Expense expense = expenseDao.findByCompanyIdAndProjectIdAndTaskIdAndExpenseId(
      companyId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    return new ExpenseResponseDto(expense.getId(), expense.getName(), expense.getPrice(),
      expense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public ExpenseResponseDto createExpense(
    ExpenseCreateRequestDto createRequestDto, Long companyId, Long projectId, Long taskId)
    throws ConstraintViolationException {
    Task task = getTask(companyId, projectId, taskId);
    Expense expense = new Expense(createRequestDto.name(), createRequestDto.price(),
      createRequestDto.paid(), task);
    Expense savedExpense = expenseDao.save(expense);
    return new ExpenseResponseDto(savedExpense.getId(), savedExpense.getName(),
      savedExpense.getPrice(), savedExpense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public ExpenseResponseDto updateExpense(
    ExpenseUpdateRequestDto updateRequestDto, Long companyId, Long projectId, Long taskId,
    Long expenseId) throws ConstraintViolationException {
    Expense expense = expenseDao.findByCompanyIdAndProjectIdAndTaskIdAndExpenseId(
      companyId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    expense.setName(updateRequestDto.name());
    expense.setPrice(updateRequestDto.price());
    expense.setPaid(updateRequestDto.paid());
    Expense savedExpense = expenseDao.save(expense);
    return new ExpenseResponseDto(savedExpense.getId(), savedExpense.getName(),
      savedExpense.getPrice(), savedExpense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_EMPLOYEE')")
  public void deleteExpense(Long companyId, Long projectId, Long taskId, Long expenseId) {
    Expense expense = expenseDao.findByCompanyIdAndProjectIdAndTaskIdAndExpenseId(
      companyId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    expenseDao.delete(expense);
  }

  private Project getProject(Long companyId, Long projectId) {
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(
      () -> new ProjectNotFoundException(projectId)
    );
    return project;
  }

  private Task getTask(Long companyId, Long projectId, Long taskId) {
    Task task = taskDao.findByCompanyIdAndProjectIdAndTaskId(companyId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    return task;
  }

}
