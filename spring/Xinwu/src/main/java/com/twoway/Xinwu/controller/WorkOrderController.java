package com.twoway.Xinwu.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class WorkOrderController {

  @Autowired
  private WorkOrderRepository workOrderRepository;

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
  public ResponseEntity<List<WorkOrder>> getAllWorkOrders() {
      List<WorkOrder> workOrders = workOrderRepository.findAll();
      return ResponseEntity.ok(workOrders);
  }

  //SEARCH API
    @GetMapping("/search-work-orders")
  public ResponseEntity<List<WorkOrder>> searchWorkOrders(
      @RequestParam(required = false) String workOrderNumber,
      @RequestParam(required = false) Integer quantity,
      @RequestParam(required = false) String partNumber,
      @RequestParam(required = false) String company,
      @RequestParam(required = false) String createUser,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate productionDateStart,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate productionDateEnd
  ) {
      List<WorkOrder> workOrders = workOrderRepository.searchWorkOrders(
          workOrderNumber,
          quantity,
          partNumber,
          company,
          createUser,
          productionDateStart,
          productionDateEnd
      );
      return ResponseEntity.ok(workOrders);
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