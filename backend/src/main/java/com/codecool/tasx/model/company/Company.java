package com.codecool.tasx.model.company;

import com.codecool.tasx.model.company.project.Project;
import com.codecool.tasx.model.request.CompanyJoinRequest;
import com.codecool.tasx.model.user.ApplicationUser;
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
public class Company {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column(length = 500)
  private String description;

  @OneToMany(mappedBy = "company", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<Project> projects;

  @OneToMany(mappedBy = "company", orphanRemoval = true, cascade = CascadeType.REMOVE)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<CompanyJoinRequest> joinRequests = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "company_admins", joinColumns = @JoinColumn(name = "company_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> admins;

  @ManyToMany
  @JoinTable(name = "company_editors", joinColumns = @JoinColumn(name = "company_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> editors;

  @ManyToMany
  @JoinTable(name = "company_employees", joinColumns = @JoinColumn(name = "company_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<ApplicationUser> employees;

  public Company(String name, String description, ApplicationUser companyCreator) {
    this.name = name;
    this.description = description;
    this.admins = new HashSet<>();
    this.editors = new HashSet<>();
    this.employees = new HashSet<>();
    this.admins.add(companyCreator);
    this.editors.add(companyCreator);
    this.employees.add(companyCreator);
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

  public Set<ApplicationUser> getEmployees() {
    return Set.copyOf(employees);
  }

  public void addEmployee(ApplicationUser applicationUser) {
    employees.add(applicationUser);
  }

  public void removeEmployee(ApplicationUser applicationUser) {
    employees.remove(applicationUser);
  }
}