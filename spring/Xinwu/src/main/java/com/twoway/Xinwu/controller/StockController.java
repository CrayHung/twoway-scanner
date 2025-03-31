package com.twoway.Xinwu.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.Stock;
import com.twoway.Xinwu.entity.StockRepository;

import jakarta.transaction.Transactional;

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

    //ACI頁面顯示目前庫存
    @GetMapping("/get-all-stock")
    public ResponseEntity<List<Stock>> getAllStocks() {
        List<Stock> stock = stockRepository.findAll();
        return ResponseEntity.ok(stock);
    }


    //ACI入庫
    @PostMapping("/post-stock")
    public ResponseEntity<?> saveStocks(@RequestBody Map<String, Object> payload) {

        Stock stock = new Stock();

        String palletName = (String) payload.get("pallet_name");
        String stockTime = (String) payload.get("stock_time");
        stock.setPalletName(palletName);
        stock.setStockTime(stockTime); 
        Stock savedStock = stockRepository.save(stock);

        return ResponseEntity.ok(savedStock);
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
