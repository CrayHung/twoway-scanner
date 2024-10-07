package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.util.MultiValueMap;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderDetailDTO;
// import com.twoway.Xinwu.repository.WorkOrderDetailDTO;
import com.twoway.Xinwu.repository.WorkOrderDetailRepository;
import com.twoway.Xinwu.repository.WorkOrderRepository;
// import com.twoway.Xinwu.repository.WorkOrderDetailSpecification;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoway.Xinwu.service.WorkOrderDetailSearchService;

import java.time.LocalDate;
import java.util.List;
// import java.util.ArrayList;
// import java.util.stream.Collectors;
// import java.util.Map;

// import org.hibernate.mapping.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class WorkOrderDetailController {

      @Autowired
      private WorkOrderDetailSearchService searchService;

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;
    
    @Autowired
    private WorkOrderRepository workOrderRepository;

    //測試檢查錯誤用變數
    private static final Logger logger = LoggerFactory.getLogger(WorkOrderDetailController.class);

    @PostMapping("/post-work-order-details")
    public ResponseEntity<String> processWorkOrderDetail(@RequestBody WorkOrderDetailRequest request) {

        //API測試
        System.out.println("Received request: " + request);
        logger.info("Received request to process work order detail: {}", request);

        // 數據驗證
    try {
        if (request.getWorkOrderNumber() == null || request.getWorkOrderNumber().isEmpty()) {
            logger.warn("Work order number is empty or null");
            return ResponseEntity.badRequest().body("工單編號不能為空");
        }
        if (request.getSN() == null || request.getSN().isEmpty()) {
            logger.warn("Sn is empty or null");
            return ResponseEntity.badRequest().body("SN不能為空");
        }

        // 檢查對應的WorkOrder是否存在
        WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(request.getWorkOrderNumber());
        if (workOrder == null) {
            logger.warn("Work order not found for number: {}", request.getWorkOrderNumber());
            return ResponseEntity.badRequest().body("找不到對應的工單");
        }

        // 創建WorkOrderDetail實體並保存到數據庫
        WorkOrderDetail workOrderDetail = new WorkOrderDetail();
        workOrderDetail.setWorkOrder(workOrder);
        workOrderDetail.setDetail_id(request.getDetail_id());
        workOrderDetail.setSn(request.getSN());
        workOrderDetail.setQrRfTray(request.getQR_RFTray());
        workOrderDetail.setQrPs(request.getQR_PS());
        workOrderDetail.setQrHs(request.getQR_HS());
        workOrderDetail.setQrBackup1(request.getQR_backup1());
        workOrderDetail.setQrBackup2(request.getQR_backup2());
        workOrderDetail.setQrBackup3(request.getQR_backup3());
        workOrderDetail.setQrBackup4(request.getQR_backup4());
        workOrderDetail.setNote(request.getNote());
        workOrderDetail.setCreate_date(LocalDate.now());
        workOrderDetail.setCreate_user(request.getCreate_user());
        workOrderDetail.setEdit_date(LocalDate.now());
        workOrderDetail.setEdit_user(request.getEdit_user());

        workOrderDetailRepository.save(workOrderDetail);
        logger.info("Work order detail saved successfully: {}", workOrderDetail);

        // 更新WorkOrder的相關字段
        workOrder.setEditDate(LocalDate.now());
        workOrder.setEditUser(request.getEdit_user());
        workOrderRepository.save(workOrder);
        logger.info("Work order updated successfully: {}", workOrder);

        return ResponseEntity.ok("工單詳細信息已成功處理");
      } catch (Exception e) {
            logger.error("Error occurred while processing work order detail", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服務器內部錯誤");
        }
    }

    // get-all API
    @GetMapping("/get-work-order-details")
       public ResponseEntity<?> getAllWorkOrderDetails() {
           try {
               List<WorkOrderDetail> workOrderDetails = workOrderDetailRepository.findAllWithWorkOrderLeftJoin();
               for (WorkOrderDetail detail : workOrderDetails) {
                logger.info("WorkOrderDetail: {}, WorkOrder: {}", detail, detail.getWorkOrder());
            }
               return ResponseEntity.ok(workOrderDetails);
           } catch (Exception e) {
               e.printStackTrace();
               return ResponseEntity.status(500).body("Error retrieving work order details: " + e.getMessage());
           }
       }

    //edit/upadate API
    @PutMapping("/update-work-order-details/{id}")
    public ResponseEntity<String> updateWorkOrderDetail(@PathVariable Long id, @RequestBody WorkOrderDetailRequest request) {
        WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(id).orElse(null);
        if (workOrderDetail == null) {
            return ResponseEntity.notFound().build();
        }

        // 更新WorkOrderDetail
        workOrderDetail.setSn(request.getSN());
        workOrderDetail.setQrRfTray(request.getQR_RFTray());
        workOrderDetail.setQrPs(request.getQR_PS());
        workOrderDetail.setQrHs(request.getQR_HS());
        workOrderDetail.setQrBackup1(request.getQR_backup1());
        workOrderDetail.setQrBackup2(request.getQR_backup2());
        workOrderDetail.setQrBackup3(request.getQR_backup3());
        workOrderDetail.setQrBackup4(request.getQR_backup4());
        workOrderDetail.setNote(request.getNote());
        workOrderDetail.setEdit_date(LocalDate.now());
        workOrderDetail.setEdit_user(request.getEdit_user());

        workOrderDetailRepository.save(workOrderDetail);

        // 更新對應的WorkOrder, & Dateime 
        WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(workOrderDetail.getParentWorkOrderNumber());
        if (workOrder != null) {
            workOrder.setEditDate(LocalDate.now());
            workOrder.setEditUser(request.getEdit_user());
            workOrderRepository.save(workOrder);
        }

        return ResponseEntity.ok("工單詳細信息已成功更新");
    }
    //範圍搜尋API
    @GetMapping("/search-work-order-details")
    public ResponseEntity<List<WorkOrderDetail>> searchWorkOrderDetails(
            @RequestParam(required = false) String workOrderNumber,
            @RequestParam(required = false) String snStart,
            @RequestParam(required = false) String snEnd,
            @RequestParam(required = false) String qrRFTray,
            @RequestParam(required = false) String qrPS,
            @RequestParam(required = false) String qrHS,
            @RequestParam(required = false) String qrBackup1,
            @RequestParam(required = false) String qrBackup2,
            @RequestParam(required = false) String qrBackup3,
            @RequestParam(required = false) String qrBackup4,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate productionDateStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate productionDateEnd) {

        logger.info("正在搜尋工單詳細資料，參數為：workOrderNumber={}, snStart={}, snEnd={}, qrRFTray={}, qrPS={}, qrHS={}, qrBackup1={}, qrBackup2={}, qrBackup3={}, qrBackup4={}, productionDateStart={}, productionDateEnd={}",
                workOrderNumber, snStart, snEnd, qrRFTray, qrPS, qrHS, qrBackup1, qrBackup2, qrBackup3, qrBackup4, productionDateStart, productionDateEnd);

        List<WorkOrderDetail> results = workOrderDetailRepository.searchWorkOrderDetails(
            workOrderNumber, snStart, snEnd, qrRFTray, qrPS, qrHS, qrBackup1, qrBackup2, qrBackup3, qrBackup4, productionDateStart, productionDateEnd);

        logger.info("搜尋完成。找到 {} 個結果。", results.size());

        return ResponseEntity.ok(results);
    }

    // 模糊搜尋 API
    
    @PostMapping("/fuzzy-search-work-order-details")
    public ResponseEntity<List<WorkOrderDetail>> fuzzySearchWorkOrderDetails(@RequestBody WorkOrderDetailDTO searchCriteria) {
        try {
            List<WorkOrderDetail> results = searchService.fuzzySearch(searchCriteria);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Error occurred while performing fuzzy search on work order details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // DEL API
    @DeleteMapping("/delete-work-order-details/{id}")
    public ResponseEntity<String> deleteWorkOrderDetail(@PathVariable Long id) {
    try {
        WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(id).orElse(null);
        if (workOrderDetail == null) {
            return ResponseEntity.notFound().build();
        }

        workOrderDetailRepository.delete(workOrderDetail);

        return ResponseEntity.ok("工單詳細信息已成功刪除");
    } catch (Exception e) {
        logger.error("Error occurred while deleting work order detail", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服務器內部錯誤");
    }
}
}

class WorkOrderDetailRequest {
    private String workOrderNumber;
    private int detail_id;

    @JsonProperty("SN")
    private String SN;

    @JsonProperty("QR_RFTray")
    private String QR_RFTray;
    
    @JsonProperty("QR_PS")
    private String QR_PS;

    @JsonProperty("QR_HS")
    private String QR_HS;

    @JsonProperty("QR_backup1")
    private String QR_backup1;

    @JsonProperty("QR_backup2")
    private String QR_backup2;

    @JsonProperty("QR_backup3")
    private String QR_backup3;
    
    @JsonProperty("QR_backup4")
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

    public int getDetail_id() {
        return detail_id;
    }

    public void setDetail_id(int detail_id) {
        this.detail_id = detail_id;
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