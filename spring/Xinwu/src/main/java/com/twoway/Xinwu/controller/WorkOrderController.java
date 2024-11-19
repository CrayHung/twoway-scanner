package com.twoway.Xinwu.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderRepository;
import com.twoway.Xinwu.dto.WorkOrderDTO;
import com.twoway.Xinwu.dto.WorkOrderSearchDTO;
import com.twoway.Xinwu.service.WorkOrderSearchService;


import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class WorkOrderController {
    
// logger 宣告
  private static final Logger logger = LoggerFactory.getLogger(WorkOrderController.class);


  @Autowired
  private WorkOrderRepository workOrderRepository;


 @Autowired
 private WorkOrderSearchService searchService;

  //POST API
  @PostMapping("/post-work-orders")
  public ResponseEntity<String> processWorkOrder(@RequestBody WorkOrderRequest request) {
      // 處理接收到的工單數據
      // 1. 數據驗證
      if (request.getWorkOrderNumber() == null || request.getWorkOrderNumber().isEmpty()) {
          return ResponseEntity.badRequest().body("工單編號不能為空");
      }
      if (request.getQuantity() <= 0) {
          return ResponseEntity.badRequest().body("數量必須大於0");
      }
      if (request.getPartNumber() == null || request.getPartNumber().isEmpty()) {
          return ResponseEntity.badRequest().body("料號不能為空");
      }
      
      // 創建 WorkOrder 實體並保存到數據庫
      WorkOrder workOrder = new WorkOrder();
      workOrder.setWorkOrderNumber(request.getWorkOrderNumber());
      workOrder.setQuantity(request.getQuantity());
      workOrder.setPartNumber(request.getPartNumber());
      workOrder.setCompany(request.getCompany());
      workOrder.setCreateUser(request.getCreateUser());
      workOrder.setCreateDate(LocalDate.now());
      workOrder.setEditUser(request.getEditUser());
      workOrder.setEditDate(LocalDate.now());
      
      workOrderRepository.save(workOrder);
      
      return ResponseEntity.ok("工單已成功處理");
  }
  
  //GET API
  @GetMapping("/get-work-orders")
  public ResponseEntity<List<WorkOrderDTO>> getAllWorkOrders() {
    try {
        List<WorkOrder> workOrders = workOrderRepository.findAll();
        List<WorkOrderDTO> dtos = workOrders.stream()
            .map(WorkOrderDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).build();
    }
  }
  
  //SEARCH API
  @PostMapping("/fuzzy-search-work-orders")
    public ResponseEntity<List<WorkOrder>> fuzzySearchWorkOrders(@RequestBody WorkOrderSearchDTO searchCriteria) {
        try {
            logger.info("正在執行工單模糊搜尋，搜尋條件為：{}", searchCriteria);
            List<WorkOrder> results = searchService.fuzzySearch(searchCriteria);

            if (results.isEmpty()) {
                logger.info("模糊搜尋無符合條件的結果");
            } else {
                logger.info("模糊搜尋完成，找到 {} 個結果", results.size());
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("執行工單模糊搜尋時發生錯誤", e);
            return ResponseEntity.status(500).body(null);
        }
    }

  //EDIT PUT API
  @PutMapping("/update-work-orders/{id}")
    public ResponseEntity<?> updateWorkOrder(@PathVariable Long id, @RequestBody WorkOrderRequest request) {
        WorkOrder existingWorkOrder = workOrderRepository.findById(id)
                .orElse(null);
        
        if (existingWorkOrder == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 驗證數據
        if (request.getWorkOrderNumber() == null || request.getWorkOrderNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("工單編號不能為空");
        }
        if (request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("數量必須大於0");
        }
        if (request.getPartNumber() == null || request.getPartNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("料號不能為空");
        }
        
        // 更新工單信息
        existingWorkOrder.updateWorkOrderNumber(request.getWorkOrderNumber());
        existingWorkOrder.setWorkOrderNumber(request.getWorkOrderNumber());
        existingWorkOrder.setQuantity(request.getQuantity());
        existingWorkOrder.setPartNumber(request.getPartNumber());
        existingWorkOrder.setCompany(request.getCompany());
        existingWorkOrder.setEditUser(request.getEditUser());
        existingWorkOrder.setEditDate(LocalDate.now());
        
        WorkOrder updatedWorkOrder = workOrderRepository.save(existingWorkOrder);
        
        return ResponseEntity.ok(updatedWorkOrder);
    }

    //Delete API
    @DeleteMapping("/delete-work-orders/{id}")
    public ResponseEntity<?> deleteWorkOrder(@PathVariable Long id) {
        WorkOrder existingWorkOrder = workOrderRepository.findById(id)
                .orElse(null);
        
        if (existingWorkOrder == null) {
            return ResponseEntity.notFound().build();
        }
        
        workOrderRepository.delete(existingWorkOrder);
        
        return ResponseEntity.ok("工單已成功刪除");
    }
}

class WorkOrderRequest {
  private String workOrderNumber;
  private int quantity;
  private String partNumber;
  private String company;
  private String createUser;
  private String editUser;



  // Getter
  public String getWorkOrderNumber() {
      return workOrderNumber;
  }
  public int getQuantity() {
      return quantity;
  }
  public String getPartNumber() {
      return partNumber;
  }
  public String getCreateUser() {
      return createUser;
  }
  public String getEditUser() {
      return editUser;
  }
  
  // Setter
  public void setWorkOrderNumber(String workOrderNumber) {
      this.workOrderNumber = workOrderNumber;
  }
  public void setQuantity(int quantity) {
      this.quantity = quantity;
  }
  public void setPartNumber(String partNumber) {
      this.partNumber = partNumber;
  }
  public void setCreateUser(String createUser) {
      this.createUser = createUser;
  }
  public void setEditUser(String editUser) {
      this.editUser = editUser;
  }
  public String getCompany() {
    return company;
}

public void setCompany(String company) {
    this.company = company;
}

  
}