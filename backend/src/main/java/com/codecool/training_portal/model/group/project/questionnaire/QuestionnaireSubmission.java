package com.codecool.training_portal.model.group.project.questionnaire;

import com.codecool.training_portal.model.auth.ApplicationUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class QuestionnaireSubmission {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @Min(1)
  private Integer maxPoints = 1;

  @Column(nullable = false)
  @Min(0)
  private Integer receivedPoints = 0;

  @ManyToOne
  @JoinColumn(name = "questionnaire_id", nullable = false)
  private Questionnaire questionnaire;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private ApplicationUser user;


  @OneToMany(mappedBy = "questionnaireSubmission", orphanRemoval = true, cascade = CascadeType.ALL,
    fetch = FetchType.LAZY)
  @OrderBy("questionOrder")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private List<SubmittedQuestion> submittedQuestions = new ArrayList<>();


  @CreationTimestamp
  private Instant createdAt;

  public QuestionnaireSubmission(
    Questionnaire questionnaire, ApplicationUser user) {
    this.questionnaire = questionnaire;
    this.user = user;
  }
}
