package com.codecool.training_portal.model.group.project.questionnaire;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionCreateRequestDto;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

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

  @Column(nullable = false)
  private String description;

  @OneToMany(mappedBy = "questionnaire", orphanRemoval = true, cascade = CascadeType.ALL,
    fetch = FetchType.LAZY)
  @OrderBy("questionOrder")
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Set<Question> questions = new HashSet<>();

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

  public void addQuestion(Question question) {
    questions.add(question);
  }

  public void removeQuestion(Question question) {
    this.questions.remove(question);
  }

  public void removeAllQuestions() { this.questions.clear(); }
}
