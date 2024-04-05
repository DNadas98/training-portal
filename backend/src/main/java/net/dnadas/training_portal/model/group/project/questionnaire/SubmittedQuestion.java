package net.dnadas.training_portal.model.group.project.questionnaire;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submitted_question")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class SubmittedQuestion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 10000, nullable = false)
  private String text;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private QuestionType type;

  @Column(nullable = false)
  @Min(1)
  private Integer questionOrder;

  @Column(nullable = false)
  @Min(1)
  private Integer maxPoints;

  @Column(nullable = false)
  @Min(0)
  private Integer receivedPoints;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "questionnaire_submission_id", nullable = false)
  private QuestionnaireSubmission questionnaireSubmission;

  @OneToMany(mappedBy = "submittedQuestion", orphanRemoval = true, cascade = CascadeType.ALL,
    fetch = FetchType.EAGER)
  @OrderBy("answerOrder")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private List<SubmittedAnswer> submittedAnswers = new ArrayList<>();

  public SubmittedQuestion(
    String text, QuestionType type, Integer order, Integer maxPoints, Integer receivedPoints,
    QuestionnaireSubmission questionnaireSubmission) {
    this.text = text;
    this.type = type;
    this.questionOrder = order;
    this.maxPoints = maxPoints;
    this.receivedPoints = receivedPoints;
    this.questionnaireSubmission = questionnaireSubmission;
  }
}
