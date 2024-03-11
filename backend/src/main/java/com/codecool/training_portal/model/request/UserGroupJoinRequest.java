package com.codecool.training_portal.model.request;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.UserGroup;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_join_request")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class UserGroupJoinRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "group_id")
  @ToString.Exclude
  private UserGroup userGroup;

  @ManyToOne
  @JoinColumn(name = "user_id")
  @ToString.Exclude
  private ApplicationUser applicationUser;

  @Enumerated(EnumType.STRING)
  private RequestStatus status;

    public UserGroupJoinRequest(UserGroup userGroup, ApplicationUser applicationUser) {
        this.userGroup = userGroup;
    this.applicationUser = applicationUser;
    this.status = RequestStatus.PENDING;
  }
}
