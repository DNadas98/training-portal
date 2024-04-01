package net.dnadas.training_portal.exception.group.project.questionnaire;

public class QuestionnaireNotFoundException extends RuntimeException {
  public QuestionnaireNotFoundException() {
    super("The requested questionnaire was not found");
  }
}
