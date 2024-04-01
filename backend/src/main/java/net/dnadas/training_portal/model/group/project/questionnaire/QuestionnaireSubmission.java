package net.dnadas.training_portal.model.group.project.questionnaire;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import net.dnadas.training_portal.model.auth.ApplicationUser;
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

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private QuestionnaireStatus status;

  @CreationTimestamp
  private Instant createdAt;

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

  public QuestionnaireSubmission(
    Questionnaire questionnaire, ApplicationUser user, QuestionnaireStatus status) {
    this.questionnaire = questionnaire;
    this.user = user;
    this.status = status;
  }
}
