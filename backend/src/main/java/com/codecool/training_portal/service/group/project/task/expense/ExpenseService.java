package com.codecool.training_portal.service.group.project.task.expense;

import com.codecool.training_portal.dto.group.project.task.expense.ExpenseCreateRequestDto;
import com.codecool.training_portal.dto.group.project.task.expense.ExpenseResponseDto;
import com.codecool.training_portal.dto.group.project.task.expense.ExpenseUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.group.project.task.TaskNotFoundException;
import com.codecool.training_portal.exception.group.project.task.expense.ExpenseNotFoundException;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.group.project.task.TaskDao;
import com.codecool.training_portal.model.group.project.task.expense.Expense;
import com.codecool.training_portal.model.group.project.task.expense.ExpenseDao;
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
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public List<ExpenseResponseDto> getAllExpenses(Long groupId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
      Task task = getTask(groupId, projectId, taskId);
    Set<Expense> expenses = task.getExpenses();
    return expenses.stream().map(
      expense -> new ExpenseResponseDto(expense.getId(), expense.getName(), expense.getPrice(),
        expense.isPaid())).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public Double sumAllExpensesInTask(Long groupId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
      Task task = getTask(groupId, projectId, taskId);
    return expenseDao.sumAllExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public Double sumUnpaidExpensesInTask(Long groupId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
      Task task = getTask(groupId, projectId, taskId);
    return expenseDao.sumUnpaidExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public Double sumPaidExpensesInTask(Long groupId, Long projectId, Long taskId)
    throws ProjectNotFoundException, UnauthorizedException {
      Task task = getTask(groupId, projectId, taskId);
    return expenseDao.sumPaidExpensesInTask(task).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public Double sumAllExpensesInProject(Long groupId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = getProject(groupId, projectId);
    return expenseDao.sumAllExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public Double sumUnpaidExpensesInProject(Long groupId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = getProject(groupId, projectId);
    return expenseDao.sumUnpaidExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public Double sumPaidExpensesInProject(Long groupId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = getProject(groupId, projectId);
    return expenseDao.sumPaidExpensesInProject(project).orElse(0.0);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public ExpenseResponseDto getExpense(
          Long groupId, Long projectId, Long taskId, Long expenseId) throws UnauthorizedException {
      Expense expense = expenseDao.findByGroupIdAndProjectIdAndTaskIdAndExpenseId(
              groupId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    return new ExpenseResponseDto(expense.getId(), expense.getName(), expense.getPrice(),
      expense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public ExpenseResponseDto createExpense(
          ExpenseCreateRequestDto createRequestDto, Long groupId, Long projectId, Long taskId)
    throws ConstraintViolationException {
      Task task = getTask(groupId, projectId, taskId);
    Expense expense = new Expense(createRequestDto.name(), createRequestDto.price(),
      createRequestDto.paid(), task);
    Expense savedExpense = expenseDao.save(expense);
    return new ExpenseResponseDto(savedExpense.getId(), savedExpense.getName(),
      savedExpense.getPrice(), savedExpense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public ExpenseResponseDto updateExpense(
          ExpenseUpdateRequestDto updateRequestDto, Long groupId, Long projectId, Long taskId,
    Long expenseId) throws ConstraintViolationException {
      Expense expense = expenseDao.findByGroupIdAndProjectIdAndTaskIdAndExpenseId(
              groupId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    expense.setName(updateRequestDto.name());
    expense.setPrice(updateRequestDto.price());
    expense.setPaid(updateRequestDto.paid());
    Expense savedExpense = expenseDao.save(expense);
    return new ExpenseResponseDto(savedExpense.getId(), savedExpense.getName(),
      savedExpense.getPrice(), savedExpense.isPaid());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public void deleteExpense(Long groupId, Long projectId, Long taskId, Long expenseId) {
      Expense expense = expenseDao.findByGroupIdAndProjectIdAndTaskIdAndExpenseId(
              groupId, projectId, taskId, expenseId).orElseThrow(() -> new ExpenseNotFoundException());
    expenseDao.delete(expense);
  }

    private Project getProject(Long groupId, Long projectId) {
        Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId)
    );
    return project;
  }

    private Task getTask(Long groupId, Long projectId, Long taskId) {
        Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    return task;
  }

}
