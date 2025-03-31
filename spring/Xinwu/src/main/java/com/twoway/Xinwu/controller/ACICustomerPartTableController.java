package com.twoway.Xinwu.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.ACICustomerPartTable;
import com.twoway.Xinwu.entity.ACICustomerPartTableRepository;

import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ACICustomerPartTableController {

    @Autowired
    private ACICustomerPartTableRepository aCICustomerPartTableRepository;

    //ACI頁面顯示目前庫存
    @GetMapping("/get-all-customerTable")
    public ResponseEntity<List<ACICustomerPartTable>> getAllCustomer() {
        List<ACICustomerPartTable> customerTable = aCICustomerPartTableRepository.findAll();
        return ResponseEntity.ok(customerTable);
    }

    @PostMapping("/post-customer")
    public ResponseEntity<?> saveCustomer(@RequestBody Map<String, Object> payload) {

        ACICustomerPartTable customer = new ACICustomerPartTable();

        String aciPartNumber = (String) payload.get("aciPartNumber");
        String customerPartNumber = (String) payload.get("customerPartNumber");
        String customerName = (String) payload.get("customerName");
        String inputMode = (String) payload.get("inputMode");
        customer.setAciPartNumber(aciPartNumber);
        customer.setCustomerPartNumber(customerPartNumber);
        customer.setCustomerName(customerName);
        customer.setInputMode(inputMode);

        ACICustomerPartTable savedCustomer = aCICustomerPartTableRepository.save(customer);

        return ResponseEntity.ok(savedCustomer);
    }


    @DeleteMapping("/del-acipart/{id}")
    public ResponseEntity<String> deleteACIPart(@PathVariable Long id) {
        if (aCICustomerPartTableRepository.existsById(id)) {
            aCICustomerPartTableRepository.deleteById(id);
            return ResponseEntity.ok("ACI Part with ID " + id + " has been deleted.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("ACI Part with ID " + id + " not found.");
        }
    }
    

    @PutMapping("/put-acipart/{id}")
    public ResponseEntity<Map<String, String>> updateACIPart(@PathVariable Long id, @RequestBody ACICustomerPartTable updatedPart) {
        return aCICustomerPartTableRepository.findById(id)
            .map(existingPart -> {
                existingPart.setAciPartNumber(updatedPart.getAciPartNumber());
                existingPart.setCustomerPartNumber(updatedPart.getCustomerPartNumber());
                existingPart.setCustomerName(updatedPart.getCustomerName());

                aCICustomerPartTableRepository.save(existingPart);

                // 返回 JSON 格式的成功訊息
                Map<String, String> response = new HashMap<>();
                response.put("message", "ACI Part with ID " + id + " has been updated.");
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                // 返回 JSON 格式的錯誤訊息
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "ACI Part with ID " + id + " not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            });
    }

    
}
