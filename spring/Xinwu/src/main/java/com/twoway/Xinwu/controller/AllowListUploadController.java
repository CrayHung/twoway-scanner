package com.twoway.Xinwu.controller;

import java.util.List;
import javax.xml.crypto.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.twoway.Xinwu.service.DataUploadService;

import org.apache.poi.ss.usermodel.*;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


import io.jsonwebtoken.io.IOException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/upload")
public class AllowListUploadController {
    
    @Autowired
    private DataUploadService dataUploadService;
    
    @PostMapping
    public ResponseEntity<String> handleFileUpload(@RequestParam("files") List<MultipartFile> files) throws java.io.IOException {
        try {
            dataUploadService.processExcelFiles(files);
            return ResponseEntity.ok("上傳成功");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process file: " + e.getMessage());
        }
    }
}
