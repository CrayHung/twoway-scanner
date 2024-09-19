package com.twoway.Xinwu.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class WorkOrderController {

  @Autowired
  private WorkOrderRepository workOrderRepository;

  @PostMapping("/work-order")
  public ResponseEntity<String> processWorkOrder(@RequestBody WorkOrderRequest request) {
      //處理接收到的工單數據
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

    workOrderRepository.save(workOrder);
      

    return ResponseEntity.ok("工單已成功處理");
  }
}
class WorkOrderRequest {
  private String workOrderNumber;
  private int quantity;
  private String partNumber;

  //Getter
  public String getWorkOrderNumber() {
    return workOrderNumber;
  }
  public int getQuantity() {
    return quantity;
  }
  public String getPartNumber() {
    return partNumber;
  }

  //Setter
  public void setWorkOrderNumber(String workOrderNumber) {
    this.workOrderNumber = workOrderNumber;
  }
  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
  public void setPartNumber(String partNumber) {
    this.partNumber = partNumber;
  }
}
