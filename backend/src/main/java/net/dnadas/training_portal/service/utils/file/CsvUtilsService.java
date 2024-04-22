package net.dnadas.training_portal.service.utils.file;

import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.PreRegisterUserInternalDto;
import net.dnadas.training_portal.dto.user.PreRegisterUsersInternalDto;
import net.dnadas.training_portal.exception.utils.file.InvalidFileException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvUtilsService {
  private final static String PRE_REGISTER_USERS_DELIMITER = ",";
  private final static int PRE_REGISTER_USERS_EXPECTED_COLUMNS = 2;
  private final static List PRE_REGISTER_USERS_HEADERS = List.of("Username", "Email");
  private final Validator validator;

  public void verifyCsv(MultipartFile file, Integer maxSize) throws InvalidFileException {
    if (file.isEmpty() || file.getContentType() == null || !file.getContentType().equals(
      "text/csv") || file.getSize() > maxSize) {
      throw new InvalidFileException("Invalid file type or size");
    }
  }

  public byte[] getPreRegisterUsersCsvTemplate() {
    StringBuilder csvBuilder = new StringBuilder();
    csvBuilder.append(String.join(PRE_REGISTER_USERS_DELIMITER, PRE_REGISTER_USERS_HEADERS)).append(
      "\n");
    csvBuilder.append("exampleUser1").append(PRE_REGISTER_USERS_DELIMITER).append(
      "example1@example.com").append("\n");
    csvBuilder.append("exampleUser2").append(PRE_REGISTER_USERS_DELIMITER).append(
      "example2@example.com").append("\n");
    return csvBuilder.toString().getBytes();
  }

  public PreRegisterUsersInternalDto parsePreRegisterUsersRequestCsv(MultipartFile usersCsv) {
    List<List<String>> records = getRecords(usersCsv, PRE_REGISTER_USERS_DELIMITER);
    List<PreRegisterUserInternalDto> users = getPreRegisterUsers(
      records, PRE_REGISTER_USERS_EXPECTED_COLUMNS);
    return new PreRegisterUsersInternalDto(users);
  }

  private List<PreRegisterUserInternalDto> getPreRegisterUsers(
    List<List<String>> records, int EXPECTED_COLUMNS) {
    List<PreRegisterUserInternalDto> users = new ArrayList<>();
    for (int i = 0; i < records.size(); i++) {
      List<String> record = records.get(i);
      if (record.equals(PRE_REGISTER_USERS_HEADERS)) {
        //skip headers
        continue;
      }
      if (record.size() != EXPECTED_COLUMNS) {
        throw new InvalidFileException("Invalid record length at record " + i + 1);
      }
      PreRegisterUserInternalDto user = new PreRegisterUserInternalDto(
        record.get(0), record.get(1));
      validator.validate(user);
      users.add(user);
    }
    return users;
  }

  private List<List<String>> getRecords(MultipartFile csvFile, String delimiter) {
    try (BufferedReader reader = new BufferedReader(
      new InputStreamReader(csvFile.getInputStream(), StandardCharsets.UTF_8))) {
      List<List<String>> records = new ArrayList<>();
      String line;
      while ((line = reader.readLine()) != null) {
        if (line.trim().isEmpty()) {
          continue;
        }
        records.add(Arrays.stream(line.split(delimiter)).map(String::trim).toList());
      }
      return records;
    } catch (IOException e) {
      throw new RuntimeException("Error reading CSV file", e);
    }
  }
}
