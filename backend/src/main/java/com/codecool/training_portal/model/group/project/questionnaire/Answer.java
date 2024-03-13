package com.codecool.training_portal.model.group.project.questionnaire;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "answer")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Answer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String text;

  @Column(nullable = false)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Boolean correct;

  @Column(nullable = false)
  @Min(1)
  private Integer answerOrder;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id", nullable = false)
  private Question question;

  public Answer(String text, Boolean correct, Integer order, Question question) {
    this.text = text;
    this.correct = correct;
    this.answerOrder = order;
    this.question = question;
  }
}
