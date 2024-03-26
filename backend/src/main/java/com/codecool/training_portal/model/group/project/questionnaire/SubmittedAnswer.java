package com.codecool.training_portal.model.group.project.questionnaire;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "submitted_answer")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class SubmittedAnswer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String text;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private SubmittedAnswerStatus status;

  @Column(nullable = false)
  @Min(1)
  private Integer answerOrder;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "submitted_question_id", nullable = false)
  private SubmittedQuestion submittedQuestion;

  public SubmittedAnswer(
    String text, Integer order, SubmittedAnswerStatus status, SubmittedQuestion submittedQuestion) {
    this.text = text;
    this.status = status;
    this.answerOrder = order;
    this.submittedQuestion = submittedQuestion;
  }
}
