package com.twoway.Xinwu.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.Shipped;
import com.twoway.Xinwu.entity.ShippedRepository;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
public class ShippedController {

    @Autowired
    private ShippedRepository shippedRepository;

    //已出貨資料 加入到shipped表
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
        List<Shipped> shippedList = shippedRepository.findAll();
        return ResponseEntity.ok(shippedList);
    }
    
}
