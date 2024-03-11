package com.codecool.tasx.model.company.project.task;

import com.codecool.tasx.model.company.project.Project;
import com.codecool.tasx.model.company.project.task.expense.Expense;
import com.codecool.tasx.model.user.ApplicationUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;

  @Column(length = 500)
  private String description;
  private Importance importance;
  private Integer difficulty;
  private Instant startDate;
  private Instant deadline;
  private TaskStatus taskStatus;

  @ManyToOne
  @JoinColumn(name = "project_id")
  @ToString.Exclude
  private Project project;

  @OneToMany(mappedBy = "task", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<Expense> expenses;

  @ManyToMany
  @JoinTable(name = "task_assigned_employees", joinColumns = @JoinColumn(name = "task_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> assignedEmployees;


  public Task(
    String name, String description, Importance importance, Integer difficulty,
    Instant startDate, Instant deadline, TaskStatus taskStatus, Project project,
    ApplicationUser taskCreator) {
    this.name = name;
    this.description = description;
    this.importance = importance;
    this.difficulty = difficulty;
    this.startDate = startDate;
    this.deadline = deadline;
    this.taskStatus = taskStatus;
    this.project = project;
    this.assignedEmployees = new HashSet<>();
    this.assignedEmployees.add(taskCreator);
    this.expenses = new HashSet<>();
  }

  public Set<Expense> getExpenses() {
    return Set.copyOf(expenses);
  }

  public void addExpense(Expense expense) {
    this.expenses.add(expense);
  }

  public void removeExpense(Expense expense) {
    this.expenses.remove(expense);
  }

  public Set<ApplicationUser> getAssignedEmployees() {
    return Set.copyOf(this.assignedEmployees);
  }

  public void assignEmployee(ApplicationUser applicationUser) {
    this.assignedEmployees.add(applicationUser);
  }

  public void removeEmployee(ApplicationUser applicationUser) {
    this.assignedEmployees.remove(applicationUser);
  }
}
