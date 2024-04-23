package net.dnadas.training_portal.model.group.project.task;

import jakarta.persistence.*;
import lombok.*;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.user.ApplicationUser;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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
  @Column(nullable = false)
  private String name;

  @Column(length = 255, nullable = false)
  private String description;
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private Importance importance;
  @Column(nullable = false)
  private Integer difficulty;
  @Column(nullable = false)
  private Instant startDate;
  @Column(nullable = false)
  private Instant deadline;
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private TaskStatus taskStatus;

  @ManyToOne
  @JoinColumn(name = "project_id")
  @ToString.Exclude
  private Project project;

  @ManyToMany
  @JoinTable(name = "task_assigned_members", joinColumns = @JoinColumn(name = "task_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> assignedMembers;


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
    this.assignedMembers = new ArrayList<>();
    this.assignedMembers.add(taskCreator);
  }

  public List<ApplicationUser> getAssignedMembers() {
    return List.copyOf(this.assignedMembers);
  }

  public void assignMember(ApplicationUser applicationUser) {
    this.assignedMembers.add(applicationUser);
  }

  public void removeMember(ApplicationUser applicationUser) {
    this.assignedMembers.remove(applicationUser);
  }
}
