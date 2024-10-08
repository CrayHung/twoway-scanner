package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.domain.Specification;
// import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.util.MultiValueMap;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.dto.WorkOrderDetailDTO;
import com.twoway.Xinwu.dto.WorkOrderFieldSearchDTO;
import com.twoway.Xinwu.entity.WorkOrder;
// import com.twoway.Xinwu.repository.WorkOrderDetailDTO;
import com.twoway.Xinwu.repository.WorkOrderDetailRepository;
import com.twoway.Xinwu.repository.WorkOrderRepository;
// import com.twoway.Xinwu.repository.WorkOrderDetailSpecification;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoway.Xinwu.service.WorkOrderDetailSearchService;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
// import java.util.stream.Collectors;
import java.util.Map;
import java.util.Set;

// import org.hibernate.mapping.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class WorkOrderDetailController {

      @Autowired
      private WorkOrderDetailSearchService searchService;

      @Autowired
    private WorkOrderDetailSearchService workOrderDetailSearchService;

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;
    
    @Autowired
    private WorkOrderRepository workOrderRepository;

    //測試檢查錯誤用變數
    private static final Logger logger = LoggerFactory.getLogger(WorkOrderDetailController.class);


    @Transactional
    @PostMapping("/post-work-order-details")
    public ResponseEntity<String> processWorkOrderDetail(@RequestBody List<WorkOrderDetailRequest> requests) {

          StringBuilder response = new StringBuilder();
          List<String> errors = new ArrayList<>();

        // 獲取所有請求的工單號
        Set<String> workOrderNumbers = requests.stream()
                .map(WorkOrderDetailRequest::getWorkOrderNumber)
                .collect(Collectors.toSet());

        // 獲取當前每個工單的最大 detailId
        Map<String, Integer> maxDetailIds = workOrderNumbers.stream()
            .collect(Collectors.toMap(
                    workOrderNumber -> workOrderNumber,
                    workOrderNumber -> workOrderDetailRepository.findMaxDetailIdByWorkOrderNumber(workOrderNumber)
            ));

        //API測試
        System.out.println("Received request: " + requests);
        logger.info("Received request to process work order detail: {}", requests);

        // 數據驗證
  for (WorkOrderDetailRequest request : requests) {
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

        // 獲取當前 detailId 並檢查是否超過數量限制
        Integer currentDetailId = maxDetailIds.get(request.getWorkOrderNumber());
        int newDetailId = (currentDetailId == null) ? 1 : currentDetailId + 1;

        if (newDetailId > workOrder.getQuantity()) {
            errors.add("工單 " + request.getWorkOrderNumber() + " 的詳情數量已達到上限 " + workOrder.getQuantity());
            continue;
        }

        // 更新 maxDetailIds
        maxDetailIds.put(request.getWorkOrderNumber(), newDetailId);


        // 創建WorkOrderDetail實體並保存到數據庫
        WorkOrderDetail workOrderDetail = new WorkOrderDetail();
        workOrderDetail.setWorkOrder(workOrder);
        workOrderDetail.setDetailId(newDetailId);  // 設置新的 detailId
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

        response.append("工單詳細信息已成功處理: ").append(request.getWorkOrderNumber())
        .append(", detailId: ").append(newDetailId)
        .append(", 當前數量: ").append(newDetailId)
        .append("/").append(workOrder.getQuantity())
        .append("\n");
      } catch (Exception e) {
          logger.error("Error occurred while processing work order detail", e);
          errors.add("處理工單時發生錯誤: " + request.getWorkOrderNumber() + " - " + e.getMessage());
      }
  }

  if (!errors.isEmpty()) {
      response.append("\n錯誤信息:\n");
      errors.forEach(error -> response.append(error).append("\n"));
      return ResponseEntity.badRequest().body(response.toString());
  }

  return ResponseEntity.ok(response.toString());
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


    //SN與日期範圍，其餘搜尋API
    @PostMapping("/snfield-search-details")
    public ResponseEntity<List<WorkOrderDetail>> searchWorkOrderDetails(@RequestBody WorkOrderFieldSearchDTO request) {
        logger.info("正在使用SN搜尋的範圍，參數為：{}", request);

        List<WorkOrderDetail> results = workOrderDetailSearchService.searchWorkOrderDetails(request);

        logger.info("搜尋完成。找到 {} 個結果。", results.size());

        return ResponseEntity.ok(results);
    }


    // SN 模糊搜尋 API
    @PostMapping("/snfuzzy-search-details")
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

    // 新增一個無參數構造函數
    public WorkOrderDetailRequest() {}

    // 新增一個帶參數的構造函數
    public WorkOrderDetailRequest(String workOrderNumber, String SN, 
                                    String QR_RFTray, String QR_PS, String QR_HS, 
                                    String QR_backup1, String QR_backup2, String QR_backup3, 
                                    String QR_backup4, String note, String create_user, String edit_user) {
        this.workOrderNumber = workOrderNumber;
       
        this.SN = SN;
        this.QR_RFTray = QR_RFTray;
        this.QR_PS = QR_PS;
        this.QR_HS = QR_HS;
        this.QR_backup1 = QR_backup1;
        this.QR_backup2 = QR_backup2;
        this.QR_backup3 = QR_backup3;
        this.QR_backup4 = QR_backup4;
        this.note = note;
        this.create_user = create_user;
        this.edit_user = edit_user;
    }
    // Getters and setters for all fields
    // ...

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
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

