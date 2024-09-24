package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderDetailRepository;
import com.twoway.Xinwu.repository.WorkOrderRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WorkOrderDetailController {

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @PostMapping("/post-work-order-details")
    public ResponseEntity<String> processWorkOrderDetail(@RequestBody WorkOrderDetailRequest request) {
        // 數據驗證
        if (request.getWorkOrderNumber() == null || request.getWorkOrderNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("工單編號不能為空");
        }
        if (request.getSN() == null || request.getSN().isEmpty()) {
            return ResponseEntity.badRequest().body("SN不能為空");
        }

        // 檢查對應的WorkOrder是否存在
        WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(request.getWorkOrderNumber());
        if (workOrder == null) {
            return ResponseEntity.badRequest().body("找不到對應的工單");
        }

        // 創建WorkOrderDetail實體並保存到數據庫
        WorkOrderDetail workOrderDetail = new WorkOrderDetail();
        workOrderDetail.setWorkOrderNumber(request.getWorkOrderNumber());
        workOrderDetail.setDetailId(request.getDetailId());
        workOrderDetail.setSN(request.getSN());
        workOrderDetail.setQR_RFTray(request.getQR_RFTray());
        workOrderDetail.setQR_PS(request.getQR_PS());
        workOrderDetail.setQR_HS(request.getQR_HS());
        workOrderDetail.setQR_backup1(request.getQR_backup1());
        workOrderDetail.setQR_backup2(request.getQR_backup2());
        workOrderDetail.setQR_backup3(request.getQR_backup3());
        workOrderDetail.setQR_backup4(request.getQR_backup4());
        workOrderDetail.setNote(request.getNote());
        workOrderDetail.setCreate_date(LocalDateTime.now());
        workOrderDetail.setCreate_user(request.getCreate_user());
        workOrderDetail.setEdit_date(LocalDateTime.now());
        workOrderDetail.setEdit_user(request.getEdit_user());

        workOrderDetailRepository.save(workOrderDetail);

        // 更新WorkOrder的相關字段
        workOrder.setEditDate(LocalDateTime.now());
        workOrder.setEditUser(request.getEdit_user());
        workOrderRepository.save(workOrder);

        return ResponseEntity.ok("工單詳細信息已成功處理");
    }

    // get-all API
    @GetMapping("/get-work-order-details")
       public ResponseEntity<?> getAllWorkOrderDetails() {
           try {
               List<WorkOrderDetail> workOrderDetails = workOrderDetailRepository.findAll();
               return ResponseEntity.ok(workOrderDetails);
           } catch (Exception e) {
               e.printStackTrace();
               return ResponseEntity.status(500).body("Error retrieving work order details: " + e.getMessage());
           }
       }

    //edit/upadate API
    @PutMapping("/update-work-order-detail/{id}")
    public ResponseEntity<String> updateWorkOrderDetail(@PathVariable Long id, @RequestBody WorkOrderDetailRequest request) {
        WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(id).orElse(null);
        if (workOrderDetail == null) {
            return ResponseEntity.notFound().build();
        }

        // 更新WorkOrderDetail
        workOrderDetail.setSN(request.getSN());
        workOrderDetail.setQR_RFTray(request.getQR_RFTray());
        workOrderDetail.setQR_PS(request.getQR_PS());
        workOrderDetail.setQR_HS(request.getQR_HS());
        workOrderDetail.setQR_backup1(request.getQR_backup1());
        workOrderDetail.setQR_backup2(request.getQR_backup2());
        workOrderDetail.setQR_backup3(request.getQR_backup3());
        workOrderDetail.setQR_backup4(request.getQR_backup4());
        workOrderDetail.setNote(request.getNote());
        workOrderDetail.setEdit_date(LocalDateTime.now());
        workOrderDetail.setEdit_user(request.getEdit_user());

        workOrderDetailRepository.save(workOrderDetail);

        // 更新對應的WorkOrder, & Dateime 
        WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(workOrderDetail.getWorkOrderNumber());
        if (workOrder != null) {
            workOrder.setEditDate(LocalDateTime.now());
            workOrder.setEditUser(request.getEdit_user());
            workOrderRepository.save(workOrder);
        }

        return ResponseEntity.ok("工單詳細信息已成功更新");
    }
    //搜尋API
    @GetMapping("/search-work-order-details")
    public ResponseEntity<List<WorkOrderDetail>> searchWorkOrderDetails(
            @RequestParam(required = false) String workOrderNumber,
            @RequestParam(required = false) String sn,
            @RequestParam(required = false) String qrRFTray,
            @RequestParam(required = false) String qrPS,
            @RequestParam(required = false) String qrHS,
            @RequestParam(required = false) String qrBackup1,
            @RequestParam(required = false) String qrBackup2,
            @RequestParam(required = false) String qrBackup3,
            @RequestParam(required = false) String qrBackup4,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime productionDateStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime productionDateEnd) {

        List<WorkOrderDetail> results = workOrderDetailRepository.searchWorkOrderDetails(
            workOrderNumber, sn, qrRFTray, qrPS, qrHS, qrBackup1, qrBackup2, qrBackup3, qrBackup4, productionDateStart, productionDateEnd);
        return ResponseEntity.ok(results);
    }
}

class WorkOrderDetailRequest {
    private String workOrderNumber;
    private int detailId;
    private String SN;
    private String QR_RFTray;
    private String QR_PS;
    private String QR_HS;
    private String QR_backup1;
    private String QR_backup2;
    private String QR_backup3;
    private String QR_backup4;
    private String note;
    private String create_user;
    private String edit_user;

    // Getters and setters for all fields
    // ...

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public int getDetailId() {
        return detailId;
    }

    public void setDetailId(int detailId) {
        this.detailId = detailId;
    }

    public String getSN() {
        return SN;
    }

    public void setSN(String SN) {
        this.SN = SN;
    }

    public String getQR_RFTray() {
      return QR_RFTray;
    }

    public void setQR_RFTray(String qR_RFTray) {
      QR_RFTray = qR_RFTray;
    }

    public String getQR_PS() {
      return QR_PS;
    }

    public void setQR_PS(String qR_PS) {
      QR_PS = qR_PS;
    }

    public String getQR_HS() {
      return QR_HS;
    }

    public void setQR_HS(String qR_HS) {
      QR_HS = qR_HS;
    }

    public String getQR_backup1() {
      return QR_backup1;
    }

    public void setQR_backup1(String qR_backup1) {
      QR_backup1 = qR_backup1;
    }

    public String getQR_backup2() {
      return QR_backup2;
    }

    public void setQR_backup2(String qR_backup2) {
      QR_backup2 = qR_backup2;
    }

    public String getQR_backup3() {
      return QR_backup3;
    }

    public void setQR_backup3(String qR_backup3) {
      QR_backup3 = qR_backup3;
    }

    public String getQR_backup4() {
      return QR_backup4;
    }

    public void setQR_backup4(String qR_backup4) {
      QR_backup4 = qR_backup4;
    }

    public String getNote() {
      return note;
    }

    public void setNote(String note) {
      this.note = note;
    }

    public String getCreate_user() {
      return create_user;
    }

    public void setCreate_user(String create_user) {
      this.create_user = create_user;
    }
    
    // 與外部關聯之變數

    public String getEdit_user() {
        return edit_user;
    }

    public void setEdit_user(String edit_user) {
        this.edit_user = edit_user;
    }
}