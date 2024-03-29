package com.codecool.training_portal.model.group;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.request.UserGroupJoinRequest;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class UserGroup {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column(length = 255, nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private String description;

  @Column(length = 10000, nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private String detailedDescription;

  @OneToMany(mappedBy = "userGroup", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("startDate DESC")
  private List<Project> projects = new ArrayList<>();

  @OneToMany(mappedBy = "userGroup", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("updatedAt DESC")
  private List<UserGroupJoinRequest> joinRequests = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "group_admins", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> admins;

  @ManyToMany
  @JoinTable(name = "group_editors", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> editors;

  @ManyToMany
  @JoinTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> members;

  @ManyToMany
  @JoinTable(name = "group_inactive_members", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OrderBy("username ASC")
  private List<ApplicationUser> inactiveMembers = new ArrayList<>();

  public UserGroup(
    String name, String description, String detailedDescription, ApplicationUser groupCreator) {
    this.name = name;
    this.description = description;
    this.detailedDescription = detailedDescription;
    this.admins = new ArrayList<>();
    this.editors = new ArrayList<>();
    this.members = new ArrayList<>();
    this.admins.add(groupCreator);
    this.editors.add(groupCreator);
    this.members.add(groupCreator);
  }

  public List<Project> getProjects() {
    return List.copyOf(projects);
  }

  public List<ApplicationUser> getAdmins() {
    return List.copyOf(admins);
  }

  public void addAdmin(ApplicationUser applicationUser) {
    if (!members.contains(applicationUser)) {
      members.add(applicationUser);
    }
    if (!admins.contains(applicationUser)) {
      admins.add(applicationUser);
    }
  }

  public void removeAdmin(ApplicationUser applicationUser) {
    admins.remove(applicationUser);
  }

  public List<ApplicationUser> getEditors() {
    return List.copyOf(editors);
  }

  public void addEditor(ApplicationUser applicationUser) {
    if (!members.contains(applicationUser)) {
      members.add(applicationUser);
    }
    if (!editors.contains(applicationUser)) {
      editors.add(applicationUser);
    }
  }

  public void removeEditor(ApplicationUser applicationUser) {
    editors.remove(applicationUser);
  }

  public List<ApplicationUser> getMembers() {
    return List.copyOf(members);
  }

  public void addMember(ApplicationUser applicationUser) {
    if (!members.contains(applicationUser)) {
      members.add(applicationUser);
    }
  }

  public void removeMember(ApplicationUser applicationUser) {
    inactiveMembers.add(applicationUser);
    deleteMember(applicationUser);
  }

  public void deleteMember(ApplicationUser applicationUser) {
    members.remove(applicationUser);
    if (editors.contains(applicationUser)) {
      editors.remove(applicationUser);
    }
    if (admins.contains(applicationUser)) {
      admins.remove(applicationUser);
    }
  }
}