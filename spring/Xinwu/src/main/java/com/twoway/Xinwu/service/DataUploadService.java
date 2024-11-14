package com.twoway.Xinwu.service;

// DataService.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.twoway.Xinwu.entity.AllowList;
import com.twoway.Xinwu.entity.AllowListRepository;

import org.apache.poi.ss.usermodel.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.xml.crypto.Data;

@Service
public class DataUploadService {

    @Autowired
    private AllowListRepository allowListRepository;
    
    public void processExcelFiles(List<MultipartFile> files) throws IOException {
        for (MultipartFile file : files) {
            processExcelFile(file);
        }
    }

    private void processExcelFile(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = WorkbookFactory.create(inputStream);

            Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet

            Iterator<Row> rowIterator = sheet.iterator();

            List<AllowList> allowList = new ArrayList<>();

            // 如果xls第一行是標題,則加入以下用來跳過標題
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                AllowList entry = new AllowList();
                entry.setPlateNumber(getCellValue(row.getCell(0))); 
                entry.setPassStatus(getCellValue(row.getCell(1))); 
                entry.setVisitorStartStr(getCellValue(row.getCell(2)));
                entry.setVisitorEndStr(getCellValue(row.getCell(3)));

                // 判斷資料庫中是否已存在相同的plateNumber
                if (!plateNumberExists(entry.getPlateNumber())) {
                    allowList.add(entry);
                }
            }

                System.out.println("上傳的資料"+allowList);
            // allowListRepository.saveAll(allowList);
        }
    }

    // 判斷資料庫中是否已存在相同的plateNumber
    private boolean plateNumberExists(String plateNumber) {
        List<AllowList> existingEntries = allowListRepository.findByPlateNumber(plateNumber);
        return !existingEntries.isEmpty();
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue();
    }
}
