package net.dnadas.training_portal.service.utils.file;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.exception.utils.file.InvalidFileException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvUtilsService {

  /**
   * Verifies that the file is a non-empty CSV file with the correct content type and size.
   *
   * @param file        The file to verify
   * @param contentType The expected content type
   * @param maxSize     The maximum allowed file size
   * @throws InvalidFileException
   */
  public void verifyCsv(MultipartFile file, String contentType, long maxSize)
    throws InvalidFileException {
    if (file.isEmpty() || file.getContentType() == null || !file.getContentType().equals(
      contentType) || file.getSize() > maxSize) {
      throw new InvalidFileException("Invalid file type or size");
    }
  }

  /**
   * Creates a CSV file from the given data.
   *
   * @param data      The data to write
   * @param delimiter The delimiter to use
   * @param headers   The headers of the CSV file
   * @return The CSV file as a byte array
   */
  public byte[] createCsv(List<List<String>> data, String delimiter, List<String> headers) {
    StringBuilder csvBuilder = new StringBuilder(String.join(delimiter, headers) + "\n");
    for (List<String> row : data) {
      csvBuilder.append(String.join(delimiter, row)).append("\n");
    }
    return csvBuilder.toString().getBytes(StandardCharsets.UTF_8);
  }

  /**
   * Writes CSV formatted data directly to the given OutputStream.
   *
   * @param data         The data to write
   * @param delimiter    The delimiter to use
   * @param headers      The headers of the CSV file
   * @param outputStream The OutputStream to which the CSV data will be written.
   */
  public void writeCsvToStream(
    List<List<String>> data, String delimiter, List<String> headers, OutputStream outputStream)
    throws IOException {
    outputStream.write(String.join(delimiter, headers).concat("\n")
      .getBytes(StandardCharsets.UTF_8));
    for (List<String> row : data) {
      outputStream.write(String.join(delimiter, row).concat("\n").getBytes(StandardCharsets.UTF_8));
    }
  }

  /**
   * Parses a CSV file and returns the records.
   *
   * @param csvFile         The CSV file to parse
   * @param delimiter       The delimiter to use
   * @param headers         The expected headers
   * @param expectedColumns The expected number of columns
   * @return The records in the CSV file as a list of lists
   */
  public List<List<String>> parseCsv(
    MultipartFile csvFile, String delimiter, List<String> headers, int expectedColumns) {
    List<List<String>> records = getRecords(csvFile, delimiter);
    if (!records.isEmpty() && !records.get(0).equals(headers)) {
      throw new InvalidFileException("CSV does not contain the correct headers.");
    }
    validateRecords(records, expectedColumns);
    return records.subList(1, records.size());  // Skip headers
  }

  private void validateRecords(List<List<String>> records, int expectedColumns) {
    for (int i = 1; i < records.size(); i++) {
      if (records.get(i).size() != expectedColumns) {
        throw new InvalidFileException("Invalid record length at record " + i);
      }
    }
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
        records.add(Arrays.stream(line.split(delimiter, -1)).map(String::trim).toList());
      }
      return records;
    } catch (IOException e) {
      throw new RuntimeException("Error reading CSV file", e);
    }
  }
}
