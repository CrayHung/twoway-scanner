package com.twoway.Xinwu.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.Stock;
import com.twoway.Xinwu.entity.StockRepository;

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
}
