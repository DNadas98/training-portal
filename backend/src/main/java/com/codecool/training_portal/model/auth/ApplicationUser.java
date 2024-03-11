package com.codecool.training_portal.model.auth;

import com.codecool.training_portal.model.company.Company;
import com.codecool.training_portal.model.company.project.Project;
import com.codecool.training_portal.model.company.project.task.Task;
import com.codecool.training_portal.model.request.CompanyJoinRequest;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
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
  private Set<Company> adminCompanies = new HashSet<>();

  @ManyToMany(mappedBy = "editors", fetch = FetchType.LAZY)
  private Set<Company> editorCompanies = new HashSet<>();

  @ManyToMany(mappedBy = "employees", fetch = FetchType.LAZY)
  private Set<Company> employeeCompanies = new HashSet<>();

  @ManyToMany(mappedBy = "admins", fetch = FetchType.LAZY)
  private Set<Project> adminProjects = new HashSet<>();

  @ManyToMany(mappedBy = "editors", fetch = FetchType.LAZY)
  private Set<Project> editorProjects = new HashSet<>();

  @ManyToMany(mappedBy = "assignedEmployees", fetch = FetchType.LAZY)
  private Set<Project> assignedProjects = new HashSet<>();

  @ManyToMany(mappedBy = "assignedEmployees", fetch = FetchType.LAZY)
  private Set<Task> assignedTasks = new HashSet<>();

  @OneToMany(mappedBy = "applicationUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private Set<CompanyJoinRequest> joinRequests = new HashSet<>();

  @OneToMany(mappedBy = "applicationUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private Set<ProjectJoinRequest> projectJoinRequests = new HashSet<>();


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

  public void removeGlobalRole(GlobalRole globalRole) {
    this.globalRoles.remove(globalRole);
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
    // Disassociate from Company entities
    for (Company company : new HashSet<>(adminCompanies)) {
      company.removeAdmin(this);
    }
    for (Company company : new HashSet<>(editorCompanies)) {
      company.removeEditor(this);
    }
    for (Company company : new HashSet<>(employeeCompanies)) {
      company.removeEmployee(this);
    }

    // Disassociate from Project entities
    for (Project project : new HashSet<>(adminProjects)) {
      project.removeAdmin(this);
    }
    for (Project project : new HashSet<>(editorProjects)) {
      project.removeEditor(this);
    }
    for (Project project : new HashSet<>(assignedProjects)) {
      project.removeEmployee(this);
    }

    // Disassociate from Task entities
    for (Task task : new HashSet<>(assignedTasks)) {
      task.removeEmployee(this);
    }
  }
}

