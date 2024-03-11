package com.codecool.training_portal.model.group;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.request.UserGroupJoinRequest;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

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

  @Column(length = 500)
  private String description;

    @OneToMany(mappedBy = "userGroup", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<Project> projects;

    @OneToMany(mappedBy = "userGroup", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
    private Set<UserGroupJoinRequest> joinRequests = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "group_admins", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> admins;

  @ManyToMany
  @JoinTable(name = "group_editors", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> editors;

  @ManyToMany
  @JoinTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> members;

    public UserGroup(String name, String description, ApplicationUser groupCreator) {
    this.name = name;
    this.description = description;
    this.admins = new HashSet<>();
    this.editors = new HashSet<>();
        this.members = new HashSet<>();
        this.admins.add(groupCreator);
        this.editors.add(groupCreator);
        this.members.add(groupCreator);
    this.projects = new HashSet<>();
  }

  public Set<Project> getProjects() {
    return Set.copyOf(projects);
  }

  public Set<ApplicationUser> getAdmins() {
    return Set.copyOf(admins);
  }

  public void addAdmin(ApplicationUser applicationUser) {
    admins.add(applicationUser);
  }

  public void removeAdmin(ApplicationUser applicationUser) {
    admins.remove(applicationUser);
  }

  public Set<ApplicationUser> getEditors() {
    return Set.copyOf(editors);
  }

  public void addEditor(ApplicationUser applicationUser) {
    editors.add(applicationUser);
  }

  public void removeEditor(ApplicationUser applicationUser) {
    editors.remove(applicationUser);
  }

    public Set<ApplicationUser> getMembers() {
        return Set.copyOf(members);
  }

    public void addMember(ApplicationUser applicationUser) {
        members.add(applicationUser);
  }

    public void removeMember(ApplicationUser applicationUser) {
        members.remove(applicationUser);
  }
}