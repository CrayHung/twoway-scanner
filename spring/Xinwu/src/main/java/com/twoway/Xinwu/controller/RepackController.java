package com.twoway.Xinwu.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.twoway.Xinwu.entity.Repack;
import com.twoway.Xinwu.entity.RepackRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
public class RepackController {
    @Autowired
    private RepackRepository repackRepository;

     // 取得所有pack的資料
     @GetMapping("/get-all-pack")
     public ResponseEntity<List<Repack>> getAllPacks() {
         List<Repack> packs = repackRepository.findAll();
         return ResponseEntity.ok(packs);
     }


    //選擇要重工的資料 加入到repack表
    @PostMapping("/post-repack")
    public ResponseEntity<?> addRepackList(@RequestBody List<Repack> repackList) {
        if (repackList == null || repackList.isEmpty()) {
            System.out.println("repackList 為空 ");
            return ResponseEntity.badRequest().body("Error: No Repack data provided.");
        }

        try {
            List<Repack> savedRepackList = repackRepository.saveAll(repackList);
            System.out.println("savedRepackList : "+ savedRepackList);
            return ResponseEntity.ok(savedRepackList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving shipped data: " + e.getMessage());
        }
    }

}
