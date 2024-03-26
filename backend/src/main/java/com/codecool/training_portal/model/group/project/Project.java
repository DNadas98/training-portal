package com.codecool.training_portal.model.group.project;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(length = 500, nullable = false)
  private String description;

  @Column(nullable = false)
  private Instant startDate;

  @Column(nullable = false)
  private Instant deadline;

  @ManyToOne
  @JoinColumn(name = "group_id")
  private UserGroup userGroup;

  @OneToMany(mappedBy = "project", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("startDate ASC")
  private List<Task> tasks = new ArrayList<>();

  @OneToMany(mappedBy = "project", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("createdAt DESC")
  private List<Questionnaire> questionnaires = new ArrayList<>();

  @OneToMany(mappedBy = "project", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("updatedAt ASC")
  private List<ProjectJoinRequest> joinRequests = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "project_admins", joinColumns = @JoinColumn(name = "project_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> admins = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "project_editors", joinColumns = @JoinColumn(name = "project_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> editors = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "project_assigned_members", joinColumns = @JoinColumn(name = "project_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> assignedMembers = new ArrayList<>();

  public Project(
    String name, String description, Instant startDate, Instant deadline,
    ApplicationUser projectCreator, UserGroup userGroup) {
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.deadline = deadline;
    admins.add(projectCreator);
    editors.add(projectCreator);
    assignedMembers.add(projectCreator);
    this.userGroup = userGroup;
  }

  public List<Task> getTasks() {
    return List.copyOf(tasks);
  }

  public List<ApplicationUser> getAdmins() {
    return List.copyOf(admins);
  }

  public void addAdmin(ApplicationUser applicationUser) {
    this.admins.add(applicationUser);
  }

  public void removeAdmin(ApplicationUser applicationUser) {
    this.admins.remove(applicationUser);
  }

  public List<ApplicationUser> getEditors() {
    return List.copyOf(editors);
  }

  public void addEditor(ApplicationUser applicationUser) {
    this.editors.add(applicationUser);
  }

  public void removeEditor(ApplicationUser applicationUser) {
    this.editors.remove(applicationUser);
  }

  public List<ApplicationUser> getAssignedMembers() {
    return List.copyOf(assignedMembers);
  }

  public void assignMember(ApplicationUser applicationUser) {
    this.assignedMembers.add(applicationUser);
  }

  public void removeMember(ApplicationUser applicationUser) {
    this.assignedMembers.remove(applicationUser);
  }
}
