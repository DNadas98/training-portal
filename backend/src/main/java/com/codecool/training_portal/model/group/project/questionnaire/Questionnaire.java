package com.codecool.training_portal.model.group.project.questionnaire;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questionnaire")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Questionnaire {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Column(length = 500, nullable = false)
  private String description;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private QuestionnaireStatus status = QuestionnaireStatus.INACTIVE;

  @Column(nullable = false)
  private boolean activated = false;

  @OneToMany(mappedBy = "questionnaire", orphanRemoval = true, cascade = CascadeType.ALL,
    fetch = FetchType.LAZY)
  @OrderBy("questionOrder")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private List<Question> questions = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id", nullable = false)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Project project;

  @CreationTimestamp
  Instant createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private ApplicationUser createdBy;

  @UpdateTimestamp
  Instant updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "updated_by_user_id", nullable = false)
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private ApplicationUser updatedBy;

  public Questionnaire(
    String name, String description, Project project, ApplicationUser createdBy) {
    this.name = name;
    this.description = description;
    this.project = project;
    this.createdBy = createdBy;
    this.updatedBy = createdBy;
  }

  public void setStatus(QuestionnaireStatus status) {
    this.status = status;
    if (status == QuestionnaireStatus.ACTIVE) {
      this.activated = true;
    }
  }

  public List<Question> getQuestions() {
    return List.copyOf(questions);
  }

  public void addQuestion(Question question) {
    questions.add(question);
  }

  public void removeAllQuestions() {
    this.questions.clear();
  }
}
