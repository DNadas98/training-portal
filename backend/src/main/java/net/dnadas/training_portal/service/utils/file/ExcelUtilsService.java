package net.dnadas.training_portal.service.utils.file;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.formula.functions.T;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class ExcelUtilsService {
  private static final int MAX_IN_MEMORY_ROWS = 200;


  public void writeExcelToResponse(
    String sheetName, List<T> data, List<String> columns, List<Function<T, Object>> valueExtractors,
    OutputStream outputStream) throws IOException {
    try (SXSSFWorkbook workbook = new SXSSFWorkbook(MAX_IN_MEMORY_ROWS)) {
      Sheet sheet = workbook.createSheet(sheetName);
      createHeaderRow(sheet, columns);
      fillDataRows(sheet, data, valueExtractors);
      workbook.write(outputStream);
    }
  }

  /**
   * Creates an Excel file with the given data.
   *
   * @param sheetName       The name of the sheet.
   * @param data            The data to be written to the file.
   * @param columns         The names of the columns.
   * @param valueExtractors The functions that extract the values from the data.
   * @param <T>             The type of the data.
   * @return The Excel file as ByteArrayInputStream
   */
  public <T> ByteArrayInputStream createExcel(
    String sheetName, List<T> data, List<String> columns, List<Function<T, Object>> valueExtractors)
    throws IOException {
    try (SXSSFWorkbook workbook = new SXSSFWorkbook(MAX_IN_MEMORY_ROWS);
         ByteArrayOutputStream out = new ByteArrayOutputStream()) {
      Sheet sheet = workbook.createSheet(sheetName);
      createHeaderRow(sheet, columns);
      fillDataRows(sheet, data, valueExtractors);
      workbook.write(out);
      return new ByteArrayInputStream(out.toByteArray());
    }
  }

  public SXSSFWorkbook getWorkbook() {
    return new SXSSFWorkbook(MAX_IN_MEMORY_ROWS);
  }

  public Sheet createSheet(SXSSFWorkbook workbook, String sheetName) {
    return workbook.createSheet(sheetName);
  }

  public void createHeaderRow(Sheet sheet, List<String> columns) {
    Row headerRow = sheet.createRow(0);
    for (int i = 0; i < columns.size(); i++) {
      Cell cell = headerRow.createCell(i);
      cell.setCellValue(columns.get(i));
    }
  }

  public <T> void fillDataRows(
    Sheet sheet, List<T> data, List<Function<T, Object>> valueExtractors) {
    int rowNum = sheet.getLastRowNum() + 1;
    for (T item : data) {
      Row row = sheet.createRow(rowNum++);
      for (int i = 0; i < valueExtractors.size(); i++) {
        Cell cell = row.createCell(i);
        Object value = valueExtractors.get(i).apply(item);
        if (value != null) {
          if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
          } else if (value instanceof Long) {
            cell.setCellValue((Long) value);
          } else if (value instanceof Double) {
            cell.setCellValue((Double) value);
          } else {
            cell.setCellValue(value.toString());
          }
        }
      }
    }
  }
}
