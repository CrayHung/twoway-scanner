package com.twoway.Xinwu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.Pallet;
import com.twoway.Xinwu.entity.PalletRepository;

@RestController
@RequestMapping("/api")
public class PalletController {

    @Autowired
    private PalletRepository palletRepository;

    @PostMapping("/post-pallet")
    public ResponseEntity<?> savePallets(@RequestBody List<Pallet> pallets) {
        List<Pallet> savedPallets = palletRepository.saveAll(pallets);
        return ResponseEntity.ok(savedPallets);
    }
    
    
    @GetMapping("/get-pallet")
    public ResponseEntity<List<Pallet>> getAllPallets() {
        List<Pallet> pallets = palletRepository.findAll();
        return ResponseEntity.ok(pallets);
    }

}
