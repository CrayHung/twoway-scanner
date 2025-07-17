package com.twoway.Xinwu.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class PalletController {

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CartonDetailRepository cartonDetailRepository;

    @Autowired
    private PalletAndShipTableRepository palletAndShipTableRepository;

    /* 新增for ship */
    @PostMapping("/create-ship")
    @Transactional
    public ResponseEntity<?> createShip(@RequestBody Map<String, Object> request) {
        List<String> palletNames = (List<String>) request.get("palletNames");
        String shipId = (String) request.get("shipId");

        if (palletNames == null || palletNames.isEmpty() || shipId == null) {
            return ResponseEntity.badRequest().body("palletNames 和 shipId 不能為空");
        }

        // Save Ship
        PalletAndShipTable shipRecord = new PalletAndShipTable();
        shipRecord.setShipId(shipId);
        shipRecord.setPalletNames(String.join(",", palletNames));
        shipRecord.setStorageTime(LocalDateTime.now());
        palletAndShipTableRepository.save(shipRecord);

        // Update each Pallet's shipId
        List<Pallet> pallets = palletRepository.findByPalletNameIn(palletNames);
        for (Pallet pallet : pallets) {
            pallet.setShipId(shipId);
        }
        palletRepository.saveAll(pallets);

        return ResponseEntity.ok("Ship created with ID: " + shipId);
    }

    // 查詢shipId內涵的palletNames
    // {
    //     "id": 5,
    //     "shipId": "SHIP_20250710T023947",
    //     "palletNames": "twy1_20250710T023716_0,twy5_20250710T023724_1"
    // }
    @PostMapping("/get-pallets-by-ship")
    public ResponseEntity<?> getPalletsByShip(@RequestBody Map<String, String> request) {
        String shipId = request.get("shipId");
        if (shipId == null) {
            return ResponseEntity.badRequest().body("shipId 不能為空");
        }
        Optional<PalletAndShipTable> shipOpt = palletAndShipTableRepository.findByShipId(shipId);
        return shipOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 
     * ACI
     * 
     */

    // 更新pallet的Location
    @PutMapping("/update-pallet-location/{id}")
    @Transactional
    public ResponseEntity<Pallet> updatePalletLocation(
            @PathVariable Long id,
            @RequestBody Pallet updatedPallet) {
        Optional<Pallet> palletOptional = Optional.ofNullable(entityManager.find(Pallet.class, id));

        if (palletOptional.isPresent()) {
            Pallet pallet = palletOptional.get();
            pallet.setLocation(updatedPallet.getLocation()); // 更新 location 欄位
            entityManager.merge(pallet);
            return ResponseEntity.ok(pallet); // 返回更新後的 Pallet 資訊
        }

        return ResponseEntity.notFound().build();
    }

    // 更新pallet的quantity
    @Transactional
    @PutMapping("/update-quantity")
    public ResponseEntity<?> updatePalletQuantity(@RequestBody Map<String, Object> requestBody) {
        try {
            String palletName = (String) requestBody.get("pallet_name");
            Integer quantity = (Integer) requestBody.get("quantity");

            System.out.println("quantity的數量是 : " + quantity);

            if (palletName == null || quantity == null || quantity < 0) {
                return ResponseEntity.badRequest().body("無效的 pallet_name 或 quantity");
            }

            Optional<Pallet> palletOptional = palletRepository.findByPalletName(palletName);
            if (palletOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("找不到對應的 pallet");
            }

            Pallet pallet = palletOptional.get();
            pallet.setQuantity(quantity); // 更新數量
            palletRepository.save(pallet);

            return ResponseEntity.ok("數量更新成功");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("更新失敗: " + e.getMessage());
        }
    }


     // 更新pallet的shipId
     @Transactional
     @PutMapping("/update-shipId")
     public ResponseEntity<?> updatePalletShipId(@RequestBody Map<String, Object> requestBody) {
         try {
             String palletName = (String) requestBody.get("pallet_name");
             String shipId = (String) requestBody.get("shipId");
 
        
 
             if (palletName == null || shipId == null ) {
                 return ResponseEntity.badRequest().body("無效的 pallet_name 或 shipId");
             }
 
             Optional<Pallet> palletOptional = palletRepository.findByPalletName(palletName);
             if (palletOptional.isEmpty()) {
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body("找不到對應的 pallet");
             }
 
             Pallet pallet = palletOptional.get();
             pallet.setShipId(shipId); // 更新數量
             palletRepository.save(pallet);
 
             return ResponseEntity.ok("數量更新成功");
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("更新失敗: " + e.getMessage());
         }
     }


    // 更新pallet的quantity為0
    @PutMapping("/update-quantityToZero")
    public ResponseEntity<?> updatePalletQuantities(@RequestBody Map<String, List<String>> request) {
        List<String> palletNames = request.get("pallet_names");

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("pallet_names 不能為空");
        }

        int updatedCount = palletRepository.updateQuantityToZero(palletNames);
        return ResponseEntity.ok("成功更新 " + updatedCount + " 筆 Pallet 的 quantity 為 0");
    }

    // 取得單一pallet的資料
    @PostMapping("/get-pallet")
    public ResponseEntity<?> getPallet(@RequestBody Map<String, String> request) {
        String palletName = request.get("pallet_name");

        if (palletName == null || palletName.isEmpty()) {
            return ResponseEntity.badRequest().body("pallet_name 不能為空");
        }
        Optional<Pallet> pallets = palletRepository.findByPalletName(palletName);

        if (pallets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("未找到對應的 Pallet");
        }

        return ResponseEntity.ok(pallets.get());
    }

    // 取得複數個pallet資料
    @PostMapping("/get-multiple-pallets")
    public ResponseEntity<?> getMultiplePallets(@RequestBody List<String> palletNames) {
        System.out.println("pallet names: " + palletNames);

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("palletNames 不能為空");
        }

        List<Pallet> pallets = palletRepository.findByPalletNameIn(palletNames);

        return ResponseEntity.ok(pallets);
    }

    // 取得所有pallet的資料
    @GetMapping("/get-all-pallet")
    public ResponseEntity<List<Pallet>> getAllPallets() {
        List<Pallet> pallets = palletRepository.findAll();
        return ResponseEntity.ok(pallets);
    }

    // 將複數個pallet資料一次刪除
    @DeleteMapping("/delete-pallets")
    public ResponseEntity<?> deletePallets(@RequestBody Map<String, List<String>> requestBody) {
        List<String> palletNames = requestBody.get("pallet_names");

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No pallet names provided.");
        }

        try {
            palletRepository.deleteByPalletNameIn(palletNames);
            return ResponseEntity.ok("Deleted pallets: " + palletNames);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting pallets: " + e.getMessage());
        }
    }

    /**
     * 
     * 達運
     * 
     */

    // 達運出貨(下載棧板條碼) , 將資訊新增至pallet
    @PostMapping("/post-pallet")
    public ResponseEntity<?> savePallets(@RequestBody List<Pallet> pallets) {
        List<Pallet> savedPallets = palletRepository.saveAll(pallets);
        return ResponseEntity.ok(savedPallets);
    }

}
