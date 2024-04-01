package net.dnadas.training_portal.exception.group.project.questionnaire;

public class QuestionnaireSubmissionNotFoundException extends RuntimeException {
  public QuestionnaireSubmissionNotFoundException() {
    super("The requested questionnaire submission was not found");
  }
}
