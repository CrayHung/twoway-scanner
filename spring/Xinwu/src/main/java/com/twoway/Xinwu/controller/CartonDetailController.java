package com.twoway.Xinwu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twoway.Xinwu.entity.CartonDetail;
import com.twoway.Xinwu.entity.CartonDetailRepository;
import com.twoway.Xinwu.entity.Pallet;
import com.twoway.Xinwu.entity.PalletRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CartonDetailController {

    @Autowired
    private CartonDetailRepository cartonDetailRepository;

    @Autowired
    private PalletRepository palletRepository;

/**
 * 
 * ACI
 * 
 */

    // ACI出貨 , 刪除某棧板中的幾筆carton_details
    @Transactional
    @DeleteMapping("/carton-detail/ship")
    public ResponseEntity<?> shipCartonDetails(@RequestBody Map<String, Object> requestBody) {
        try {

            String palletName = (String) requestBody.get("pallet_name");
            
            Object idsObject = requestBody.get("ids");
            if (palletName == null || idsObject == null) {
                return ResponseEntity.badRequest().body("無效的 pallet_name 或carton ids");
            }

            // 使用 ObjectMapper 轉換成 List<Integer> 以確保類型安全
            ObjectMapper objectMapper = new ObjectMapper();
            List<Integer> ids = objectMapper.convertValue(idsObject, List.class);

            if (ids.isEmpty()) {
                return ResponseEntity.badRequest().body("ids 列表不能為空");
            }
 

            cartonDetailRepository.deleteByPalletNameAndIdIn(palletName, ids);

            return ResponseEntity.ok("出貨成功");
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("失敗: " + e.getMessage());
        }
    }

    //ACI設備轉移 (更新pallletName)
    @PutMapping("/updateCartonsPalletName")
    public ResponseEntity<String> updatePalletName(@RequestBody List<Map<String, Object>> updateRequests) {
        for (Map<String, Object> request : updateRequests) {
            List<Integer> ids = (List<Integer>) request.get("id");
            String palletName = (String) request.get("pallet_name");
            cartonDetailRepository.updatePalletName(ids, palletName);
        }
        return ResponseEntity.ok("更新成功");
    }
   
    
    

    // 取得單一個棧板中的carton_details
    @PostMapping("/get-carton-detail")
    public ResponseEntity<List<CartonDetail>> getCartonDetailsByName(@RequestBody Map<String, String> request) {
        String palletName = request.get("pallet_name");
        if (palletName == null || palletName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<CartonDetail> cartonDetails = cartonDetailRepository.findByPalletName(palletName);
        return ResponseEntity.ok(cartonDetails);
    }

/**
 * 
 * 達運
 * 
 */

    // 達運出貨(下載棧板條碼) , 將目前的資料新增carton_detail
    @PostMapping("/post-carton-details")
    public ResponseEntity<?> saveCartonDetails(@RequestBody List<CartonDetail> cartonDetails) {
        List<CartonDetail> savedDetails = cartonDetailRepository.saveAll(cartonDetails);
        return ResponseEntity.ok(savedDetails);
    }

    // 取得所有的carton_details
    @GetMapping("/get-all-carton-details")
    public ResponseEntity<List<CartonDetail>> getAllCartonDetails() {
        List<CartonDetail> details = cartonDetailRepository.findAll();
        return ResponseEntity.ok(details);
    }

}
