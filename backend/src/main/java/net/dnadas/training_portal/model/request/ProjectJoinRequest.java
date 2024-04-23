package net.dnadas.training_portal.model.request;

import jakarta.persistence.*;
import lombok.*;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.user.ApplicationUser;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

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

  @CreationTimestamp
  private Instant createdAt;

  @UpdateTimestamp
  private Instant updatedAt;

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
