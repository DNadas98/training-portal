package net.dnadas.training_portal.service.utils.file;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class ExcelUtilsService {
  private static final int MAX_IN_MEMORY_ROWS = 100;

  public SXSSFWorkbook createWorkbook() {
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

  public <T> void fillDataRow(Row row, T item, List<Function<T, Object>> valueExtractors) {
    for (int i = 0; i < valueExtractors.size(); i++) {
      Cell cell = row.createCell(i);
      Object value = valueExtractors.get(i).apply(item);
      if (value != null) {
        switch (value) {
          case Integer integer -> cell.setCellValue(integer);
          case Long l -> cell.setCellValue(l);
          case Double v -> cell.setCellValue(v);
          default -> cell.setCellValue(value.toString());
        }
      }
    }
  }
}
