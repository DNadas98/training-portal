package net.dnadas.training_portal.service.group.project.questionnaire;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsInternalDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsResponseDto;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireSubmissionDao;
import net.dnadas.training_portal.service.utils.converter.QuestionnaireSubmissionConverter;
import net.dnadas.training_portal.service.utils.file.ExcelUtilsService;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class QuestionnaireStatisticsService {
  private final QuestionnaireSubmissionDao questionnaireSubmissionDao;
  private final QuestionnaireSubmissionConverter questionnaireSubmissionConverter;
  private final ExcelUtilsService excelUtilsService;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_COORDINATOR')")
  public Page<QuestionnaireSubmissionStatsResponseDto> getQuestionnaireSubmissionStatistics(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status,
    Pageable pageable, String searchInput) {
    if (!status.equals(QuestionnaireStatus.ACTIVE)) {
      return getStatisticsByStatus(groupId, projectId, questionnaireId, status, pageable,
        searchInput);
    }
    return getStatisticsWithNonSubmittersByStatus(groupId, projectId, questionnaireId, status,
      pageable, searchInput);
  }

  /**
   * Exports all questionnaire submissions to an Excel file in paginated chunks.
   *
   * @param groupId         The group ID.
   * @param projectId       The project ID.
   * @param questionnaireId The questionnaire ID.
   * @param status          The status of the questionnaire.
   * @param response        The HttpServletResponse object needed for the output stream.
   */

  public void exportAllQuestionnaireSubmissionsToExcel(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status, String search,
    HttpServletResponse response) throws IOException {

    try (SXSSFWorkbook workbook = excelUtilsService.getWorkbook(); OutputStream outputStream = response.getOutputStream()) {
      Sheet sheet = excelUtilsService.createSheet(workbook, "Questionnaire Submissions");
      List<String> columns = List.of("Username", "Max Points Submission Date",
        "Max Points Submission Received Points", "Last Submission Date",
        "Last Submission Received Points", "Questionnaire Total Points", "Total Submissions");
      excelUtilsService.createHeaderRow(sheet, columns);
      List<Function<QuestionnaireSubmissionStatsResponseDto, Object>> valueExtractors = List.of(
        QuestionnaireSubmissionStatsResponseDto::username,
        QuestionnaireSubmissionStatsResponseDto::maxPointSubmissionCreatedAt,
        QuestionnaireSubmissionStatsResponseDto::maxPointSubmissionReceivedPoints,
        QuestionnaireSubmissionStatsResponseDto::lastSubmissionCreatedAt,
        QuestionnaireSubmissionStatsResponseDto::lastSubmissionReceivedPoints,
        QuestionnaireSubmissionStatsResponseDto::questionnaireMaxPoints,
        QuestionnaireSubmissionStatsResponseDto::submissionCount);

      int page = 0;
      final int size = 1000;
      Page<QuestionnaireSubmissionStatsInternalDto> pageData;
      do {
        Pageable pageable = PageRequest.of(page, size);
        pageData = questionnaireSubmissionDao.getQuestionnaireSubmissionStatisticsByStatus(
          groupId, projectId, questionnaireId, status, pageable, search);
        List<QuestionnaireSubmissionStatsResponseDto> dtos = pageData.map(
          questionnaireSubmissionConverter::toQuestionnaireSubmissionStatsAdminDto).getContent();
        excelUtilsService.fillDataRows(sheet, dtos, valueExtractors);
        page++;
      } while (pageData.hasNext());

      workbook.write(outputStream);
    }
  }

  private Page<QuestionnaireSubmissionStatsResponseDto> getStatisticsByStatus(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status,
    Pageable pageable, String searchInput) {
    Page<QuestionnaireSubmissionStatsInternalDto> questionnaireStats =
      questionnaireSubmissionDao.getQuestionnaireSubmissionStatisticsByStatus(groupId, projectId,
        questionnaireId, status, pageable, searchInput);
    return questionnaireStats.map(
      questionnaireSubmissionConverter::toQuestionnaireSubmissionStatsAdminDto);
  }

  private Page<QuestionnaireSubmissionStatsResponseDto> getStatisticsWithNonSubmittersByStatus(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status,
    Pageable pageable, String searchInput) {
    Page<QuestionnaireSubmissionStatsInternalDto> questionnaireStats =
      questionnaireSubmissionDao.getQuestionnaireSubmissionStatisticsWithNonSubmittersByStatus(
        groupId, projectId, questionnaireId, status, pageable, searchInput);
    Page<QuestionnaireSubmissionStatsResponseDto> responseDtos = questionnaireStats.map(
      questionnaireSubmissionConverter::toQuestionnaireSubmissionStatsAdminDto);
    return responseDtos;
  }
}
