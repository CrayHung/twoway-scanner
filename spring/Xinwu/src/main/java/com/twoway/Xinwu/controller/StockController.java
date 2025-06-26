package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.twoway.Xinwu.entity.Stock;
import com.twoway.Xinwu.entity.StockRepository;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    /**
     * 
     * ACI
     * 
     */

    // ACI頁面顯示目前庫存
    @GetMapping("/get-all-stock")
    public ResponseEntity<List<Stock>> getAllStocks() {
        List<Stock> stock = stockRepository.findAll();
        return ResponseEntity.ok(stock);
    }

    // ACI入庫
    @PostMapping("/post-stock")
    public ResponseEntity<?> saveStocks(@RequestBody Map<String, Object> payload) {

        Stock stock = new Stock();

        String palletName = (String) payload.get("pallet_name");
        String stockTime = (String) payload.get("stock_time");
        
        //新增欄位
        String shipId = (String) payload.get("ship_id");
        stock.setShipId(shipId);

        stock.setPalletName(palletName);
        stock.setStockTime(stockTime);
        Stock savedStock = stockRepository.save(stock);

        return ResponseEntity.ok(savedStock);
    }

    // ACI入庫-陣列 ["twy3_20250522T075157","2AAA"]
    // @PostMapping("/post-multiple-stocks")
    // public ResponseEntity<?> saveMultipleStocks(@RequestBody List<String> palletNames) {
    //     if (palletNames == null || palletNames.isEmpty()) {
    //         return ResponseEntity.badRequest().body("At least one pallet_name is required.");
    //     }

    //     DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    //     String currentTime = LocalDateTime.now().format(formatter);

    //     List<Stock> savedStocks = new ArrayList<>();

    //     for (String palletName : palletNames) {
    //         Stock stock = new Stock();
    //         stock.setPalletName(palletName);
    //         stock.setStockTime(currentTime);
    //         savedStocks.add(stockRepository.save(stock));
    //     }

    //     return ResponseEntity.ok(savedStocks); // 回傳儲存後的所有資料
    // }

     // ACI入庫-陣列 {palletNames:["twy3_20250522T075157","2AAA"] , shipId:"string"}
    @PostMapping("/post-multiple-stocks")
    public ResponseEntity<?> saveMultipleStocks(@RequestBody Map<String, Object> payload) {
        Object palletNamesObj = payload.get("palletNames");
        Object shipIdObj = payload.get("shipId");

        if (!(palletNamesObj instanceof List)) {
            return ResponseEntity.badRequest().body("Invalid or missing 'palletNames'.");
        }

        //Java 會警告你這是「未經檢查的類型轉換」，因為它只能檢查是 List，但無法確認 List 裡面是不是 String。
        //加上後就等於 我保證它是正確的，不要警告我。
        @SuppressWarnings("unchecked")
        List<String> palletNames = (List<String>) palletNamesObj;

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one pallet_name is required.");
        }

        String shipId = (shipIdObj != null) ? shipIdObj.toString() : null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentTime = LocalDateTime.now().format(formatter);

        List<Stock> savedStocks = new ArrayList<>();

        for (String palletName : palletNames) {
            Stock stock = new Stock();
            stock.setPalletName(palletName);
            stock.setStockTime(currentTime);
            stock.setShipId(shipId); // 可為 null
            savedStocks.add(stockRepository.save(stock));
        }

        return ResponseEntity.ok(savedStocks);
    }
     
     


    
    // 刪除指定複數個 palletNames 的資料
    @DeleteMapping("/stock/delete-by-pallet-names")
    public ResponseEntity<?> deleteStockByPalletNames(@RequestBody Map<String, List<String>> request) {
        List<String> palletNames = request.get("pallet_names");

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No pallet names provided.");
        }

        try {
            stockRepository.deleteByPalletNameIn(palletNames);
            return ResponseEntity.ok("Deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting stock data: " + e.getMessage());
        }
    }

    // 刪除指定複數個 id 的資料
    @DeleteMapping("/stock/delete-by-ids")
    public ResponseEntity<?> deleteStockByIds(@RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
        System.out.println("stock ids: " + ids);

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No IDs provided.");
        }

        try {
            stockRepository.deleteByIdIn(ids);
            return ResponseEntity.ok("Deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting stock data: " + e.getMessage());
        }
    }

}
