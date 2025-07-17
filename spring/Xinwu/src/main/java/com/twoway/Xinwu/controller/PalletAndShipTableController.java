package com.twoway.Xinwu.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.CartonDetailRepository;
import com.twoway.Xinwu.entity.Pallet;
import com.twoway.Xinwu.entity.PalletAndShipTable;
import com.twoway.Xinwu.entity.PalletAndShipTableRepository;
import com.twoway.Xinwu.entity.PalletRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
public class PalletAndShipTableController {

    @Autowired
    private PalletAndShipTableRepository palletAndShipTableRepository;

    // ACI使用ship入庫時會call這個, 如果shipId有東西則會返回palletNamesString
    // {
    // "palletNames": [
    // "twy1_20250710T023716_0",
    // "twy5_20250710T023724_1"
    // ]
    // }
    @PostMapping("/get-ship-pallets")
    public ResponseEntity<?> getPalletsByShip(@RequestBody Map<String, String> payload) {
        String shipId = payload.get("shipId");
        if (shipId == null || shipId.isEmpty()) {
            return ResponseEntity.badRequest().body("shipId is required");
        }

        Optional<PalletAndShipTable> shipOptional = palletAndShipTableRepository.findByShipId(shipId);
        if (shipOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ship not found");
        }

        String palletNamesString = shipOptional.get().getPalletNames();
        List<String> palletNames = Arrays.stream(palletNamesString.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("palletNames", palletNames);
        return ResponseEntity.ok(response);
    }

    // 新增某些palletNames的資料進入到shipId裡面
    @PostMapping("/update-ship-pallets")
    @Transactional
    public ResponseEntity<?> updateShipPallets(@RequestBody Map<String, Object> request) {
        try {
            // 取出 shipId
            String shipId = request.get("shipId") != null ? request.get("shipId").toString().trim() : null;

            // 取出 palletNames
            String palletNamesStr = null;

            Object palletNamesObj = request.get("palletNames");
            if (palletNamesObj instanceof String) {
                palletNamesStr = ((String) palletNamesObj).trim();
            } else if (palletNamesObj != null) {
                palletNamesStr = palletNamesObj.toString().trim(); // 強制轉字串保底
            }

            // 檢查必填
            if (shipId == null || shipId.isEmpty() || palletNamesStr == null || palletNamesStr.isEmpty()) {
                return ResponseEntity.badRequest().body("shipId 和 palletNames 不能為空");
            }

            // 解析 palletNames 為 List
            List<String> newPalletNames = Arrays.stream(palletNamesStr.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            // 查詢資料
            PalletAndShipTable existingRecord = palletAndShipTableRepository.findByShipId(shipId)
                    .orElseThrow(() -> new RuntimeException("找不到對應的 shipId: " + shipId));

            String existingPalletNames = existingRecord.getPalletNames();
            Set<String> palletSet = new LinkedHashSet<>();
            if (existingPalletNames != null && !existingPalletNames.isEmpty()) {
                palletSet.addAll(Arrays.asList(existingPalletNames.split(",")));
            }

            palletSet.addAll(newPalletNames);

            // 更新 & 儲存
            existingRecord.setPalletNames(String.join(",", palletSet));
            palletAndShipTableRepository.save(existingRecord);

            return ResponseEntity.ok("Pallet names 已成功加入 shipId: " + shipId);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("更新失敗：" + e.getMessage());
        }
    }

    // 達運出貨管理頁面要呼叫的,用來顯示所有組合成ship的資料
    @GetMapping("/get-all-ship-pallets")
    public ResponseEntity<List<PalletAndShipTable>> getAllShipPallets() {
        List<PalletAndShipTable> allPallets = palletAndShipTableRepository.findAll();
        return ResponseEntity.ok(allPallets);
    }

    // 輸入shipId返回該筆的整筆資料
    @PostMapping("/get-ship-details")
    public ResponseEntity<?> getShipDetails(@RequestBody Map<String, String> payload) {
        String shipId = payload.get("shipId");
        if (shipId == null || shipId.isEmpty()) {
            return ResponseEntity.badRequest().body("shipId is required");
        }

        Optional<PalletAndShipTable> shipOptional = palletAndShipTableRepository.findByShipId(shipId);
        if (shipOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ship not found");
        }

        return ResponseEntity.ok(shipOptional.get());
    }

}
