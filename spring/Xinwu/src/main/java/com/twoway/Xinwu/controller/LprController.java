package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.Record;
import com.twoway.Xinwu.entity.RecordRepository;

@CrossOrigin(origins = "*" )
@RestController
@RequestMapping("/lpr")
public class LprController {

    @Autowired
    private RecordRepository recordRepository;
    
    @GetMapping("/all")
    public Iterable<Record> getAllRecordByIdDesc() {
      return recordRepository.findAllByOrderByIdDesc();
    }


}
