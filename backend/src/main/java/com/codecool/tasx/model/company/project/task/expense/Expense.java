package com.codecool.tasx.model.company.project.task.expense;

import com.codecool.tasx.model.company.project.task.Task;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Expense {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private double price;
  private boolean paid;

  @ManyToOne
  @JoinColumn(name = "task_id")
  private Task task;

  public Expense(String name, Double price, Boolean paid, Task task) {
    this.name = name;
    this.price = price;
    this.paid = paid;
    this.task = task;
  }
}