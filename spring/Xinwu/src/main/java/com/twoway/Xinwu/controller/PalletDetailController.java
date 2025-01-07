package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.PalletDetail;
import com.twoway.Xinwu.entity.PalletDetailRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PalletDetailController {

    @Autowired
    private PalletDetailRepository palletDetailRepository;

    //新增pallet_detail
    @PostMapping("/post-pallet-details")
    public ResponseEntity<?> savePalletDetails(@RequestBody List<PalletDetail> palletDetails) {
        List<PalletDetail> savedDetails = palletDetailRepository.saveAll(palletDetails);
        return ResponseEntity.ok(savedDetails);
    }
    //所有pallet_details
    @GetMapping("/get-all-pallet-details")
    public ResponseEntity<List<PalletDetail>> getAllPalletDetails() {
        List<PalletDetail> details = palletDetailRepository.findAll();
        return ResponseEntity.ok(details);
    }

    //單一pallet_details
    @PostMapping("/get-pallet-details")
    public ResponseEntity<List<PalletDetail>> getPalletDetailsByName(@RequestBody Map<String, String> request) {
        String palletName = request.get("pallet_name");
        if (palletName == null || palletName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<PalletDetail> palletDetails = palletDetailRepository.findByPalletName(palletName);
        return ResponseEntity.ok(palletDetails);
    }
}
