package com.codecool.training_portal.model.request;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_join_request")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class ProjectJoinRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "project_id")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Project project;

  @ManyToOne
  @JoinColumn(name = "user_id")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private ApplicationUser applicationUser;

  @Enumerated(EnumType.STRING)
  private RequestStatus status;

  public ProjectJoinRequest(Project project, ApplicationUser applicationUser) {
    this.project = project;
    this.applicationUser = applicationUser;
    this.status = RequestStatus.PENDING;
  }
}
