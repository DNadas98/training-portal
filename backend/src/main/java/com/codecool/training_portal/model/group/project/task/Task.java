package com.codecool.training_portal.model.group.project.task;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.task.expense.Expense;
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
  @JoinTable(name = "task_assigned_members", joinColumns = @JoinColumn(name = "task_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> assignedMembers;


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
      this.assignedMembers = new HashSet<>();
      this.assignedMembers.add(taskCreator);
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

    public Set<ApplicationUser> getAssignedMembers() {
        return Set.copyOf(this.assignedMembers);
  }

    public void assignMember(ApplicationUser applicationUser) {
        this.assignedMembers.add(applicationUser);
  }

    public void removeMember(ApplicationUser applicationUser) {
        this.assignedMembers.remove(applicationUser);
  }
}
