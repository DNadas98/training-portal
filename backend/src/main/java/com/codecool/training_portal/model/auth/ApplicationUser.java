package com.codecool.training_portal.model.auth;

import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import com.codecool.training_portal.model.request.UserGroupJoinRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "application_user")
public class ApplicationUser implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private boolean expired;

  @Column(nullable = false)
  private boolean locked;

  @Column(nullable = false)
  private boolean credentialsExpired;

  @Column(nullable = false)
  private boolean enabled;

  @Enumerated(EnumType.STRING)
  private Set<GlobalRole> globalRoles = new HashSet<>();

  @ManyToMany(mappedBy = "admins", fetch = FetchType.LAZY)
  @OrderBy("name ASC")
  private List<UserGroup> adminUserGroups = new ArrayList<>();

  @ManyToMany(mappedBy = "editors", fetch = FetchType.LAZY)
  @OrderBy("name ASC")
  private List<UserGroup> editorUserGroups = new ArrayList<>();

  @ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
  @OrderBy("name ASC")
  private List<UserGroup> memberUserGroups = new ArrayList<>();

  @ManyToMany(mappedBy = "admins", fetch = FetchType.LAZY)
  @OrderBy("startDate ASC, name ASC")
  private List<Project> adminProjects = new ArrayList<>();

  @ManyToMany(mappedBy = "editors", fetch = FetchType.LAZY)
  @OrderBy("startDate ASC, name ASC")
  private List<Project> editorProjects = new ArrayList<>();

  @ManyToMany(mappedBy = "assignedMembers", fetch = FetchType.LAZY)
  @OrderBy("startDate ASC, name ASC")
  private List<Project> assignedProjects = new ArrayList<>();

  @ManyToMany(mappedBy = "assignedMembers", fetch = FetchType.LAZY)
  @OrderBy("startDate ASC, name ASC")
  private List<Task> assignedTasks = new ArrayList<>();

  @OneToMany(mappedBy = "applicationUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @OrderBy("updatedAt DESC")
  private List<UserGroupJoinRequest> joinRequests = new ArrayList<>();

  @OneToMany(mappedBy = "applicationUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @OrderBy("updatedAt DESC")
  private List<ProjectJoinRequest> projectJoinRequests = new ArrayList<>();


  public ApplicationUser(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.expired = false;
    this.locked = false;
    this.credentialsExpired = false;
    this.enabled = true;
    globalRoles.add(GlobalRole.USER);
  }

  public Set<GlobalRole> getGlobalRoles() {
    return Set.copyOf(globalRoles);
  }

  public void addGlobalRole(GlobalRole globalRole) {
    this.globalRoles.add(globalRole);
  }

  // UserDetails

  @Override
  public String getUsername() {
    return this.email;
  }

  public String getActualUsername() {
    return this.username;
  }

  /**
   * Returns the authorities granted to the user. Cannot return <code>null</code>.
   *
   * @return the authorities, sorted by natural key (never <code>null</code>)
   */
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.globalRoles.stream().map(role -> new SimpleGrantedAuthority(role.name())).collect(
      Collectors.toSet());
  }

  /**
   * Returns the password used to authenticate the user.
   *
   * @return the password
   */
  @Override
  public String getPassword() {
    return this.password;
  }

  /**
   * Indicates whether the user's account has expired. An expired account cannot be
   * authenticated.
   *
   * @return <code>true</code> if the user's account is valid (ie non-expired),
   * <code>false</code> if no longer valid (ie expired)
   */
  @Override
  public boolean isAccountNonExpired() {
    return !this.expired;
  }

  /**
   * Indicates whether the user is locked or unlocked. A locked user cannot be
   * authenticated.
   *
   * @return <code>true</code> if the user is not locked, <code>false</code> otherwise
   */
  @Override
  public boolean isAccountNonLocked() {
    return !this.locked;
  }

  /**
   * Indicates whether the user's credentials (password) has expired. Expired
   * credentials prevent authentication.
   *
   * @return <code>true</code> if the user's credentials are valid (ie non-expired),
   * <code>false</code> if no longer valid (ie expired)
   */
  @Override
  public boolean isCredentialsNonExpired() {
    return !this.credentialsExpired;
  }

  /**
   * Indicates whether the user is enabled or disabled. A disabled user cannot be
   * authenticated.
   *
   * @return <code>true</code> if the user is enabled, <code>false</code> otherwise
   */
  @Override
  public boolean isEnabled() {
    return this.enabled;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, globalRoles);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof ApplicationUser applicationUser)) {
      return false;
    }
    return Objects.equals(id, applicationUser.id) &&
      Objects.equals(
        username, applicationUser.username) && Objects.equals(
      globalRoles, applicationUser.globalRoles);
  }

  @Override
  public String toString() {
    return "ApplicationUser{" +
      "id=" + id +
      ", username='" + username + '\'' +
      ", globalRoles=" + globalRoles +
      '}';
  }

  @PreRemove
  private void preRemove() {
    // Disassociate from UserGroup entities
    for (UserGroup userGroup : new ArrayList<>(adminUserGroups)) {
      userGroup.removeAdmin(this);
    }
    for (UserGroup userGroup : new ArrayList<>(editorUserGroups)) {
      userGroup.removeEditor(this);
    }
    for (UserGroup userGroup : new ArrayList<>(memberUserGroups)) {
      userGroup.removeMember(this);
    }

    // Disassociate from Project entities
    for (Project project : new ArrayList<>(adminProjects)) {
      project.removeAdmin(this);
    }
    for (Project project : new ArrayList<>(editorProjects)) {
      project.removeEditor(this);
    }
    for (Project project : new ArrayList<>(assignedProjects)) {
      project.removeMember(this);
    }

    // Disassociate from Task entities
    for (Task task : new ArrayList<>(assignedTasks)) {
      task.removeMember(this);
    }
  }
}

