package com.twoway.Xinwu.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.Shipped;
import com.twoway.Xinwu.entity.ShippedRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
public class ShippedController {

    @Autowired
    private ShippedRepository shippedRepository;

    //將資料加入到shipped表
    @PostMapping("/post-shipped")
    public ResponseEntity<?> addShippedList(@RequestBody List<Shipped> shippedList) {
        if (shippedList == null || shippedList.isEmpty()) {
            System.out.println("savedShippedList為空 ");
            return ResponseEntity.badRequest().body("Error: No shipped data provided.");
        }

        try {
            List<Shipped> savedShippedList = shippedRepository.saveAll(shippedList);
            System.out.println("savedShippedList : "+ savedShippedList);
            return ResponseEntity.ok(savedShippedList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving shipped data: " + e.getMessage());
        }
    }


    //獲得所有shipped表的資料
    @GetMapping("/shipped/all")
    public ResponseEntity<List<Shipped>> getAllShipped() {
        List<Shipped> shippedList = shippedRepository.findAllByOrderByIdDesc();
        return ResponseEntity.ok(shippedList);
    }

    //回傳分組的資料 , 將相同shippedTime的打包成一組
    @GetMapping("/shipped/grouped")
    public ResponseEntity<List<Shipped>> getGroupedShipped() {
        List<Shipped> shippedList = shippedRepository.findAllByOrderByIdDesc();
        
        // 先按照 shippedTime 分組
        Map<String, List<Shipped>> groupedData = shippedList.stream()
            .collect(Collectors.groupingBy(Shipped::getShippedTime));
    
        // 把 Map 轉回 List，確保回傳格式與原本 API 一致
        List<Shipped> flattenedList = groupedData.values().stream()
            .map(group -> group.get(0)) // 只取每個 shippedTime 的第一筆
            .collect(Collectors.toList());
    
        return ResponseEntity.ok(flattenedList);
    }
    
}
