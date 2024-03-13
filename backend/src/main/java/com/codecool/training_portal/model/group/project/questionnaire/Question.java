package com.codecool.training_portal.model.group.project.questionnaire;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "question")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Question {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String text;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private QuestionType type;

  @Column(nullable = false)
  @Min(1)
  private Integer questionOrder;

  @Column(nullable = false)
  @Min(1)
  private Integer points;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "questionnaire_id", nullable = false)
  private Questionnaire questionnaire;

  @OneToMany(mappedBy = "question", orphanRemoval = true, cascade = CascadeType.ALL,
    fetch = FetchType.LAZY)
  @OrderBy("answerOrder")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<Answer> answers = new HashSet<>();

  public Question(
    String text, QuestionType type, Integer order, Integer points, Questionnaire questionnaire) {
    this.text = text;
    this.type = type;
    this.questionOrder = order;
    this.points = points;
    this.questionnaire = questionnaire;
  }

  public void addAnswer(Answer answer) {
    this.answers.add(answer);
  }

  public void removeAnswer(Answer answer) {
    this.answers.remove(answer);
  }
}
