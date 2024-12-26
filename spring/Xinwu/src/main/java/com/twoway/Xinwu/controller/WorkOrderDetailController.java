package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.domain.Specification;
// import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.util.MultiValueMap;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.dto.UpdateWorkOrderDetailDTO;
import com.twoway.Xinwu.dto.WorkOrderDetailFuzzySearchDTO;
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
import java.util.HashMap;
import java.util.HashSet;
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
  private WorkOrderDetailRepository workOrderDetailRepository;

  @Autowired
  private WorkOrderRepository workOrderRepository;

  // 測試檢查錯誤用變數
  private static final Logger logger = LoggerFactory.getLogger(WorkOrderDetailController.class);

  @Transactional
  @PostMapping("/post-work-order-details")
  public ResponseEntity<String> processWorkOrderDetail(@RequestBody List<WorkOrderDetailRequest> requests) {

    System.out.println("前端丟過來的請求:" + requests);
    StringBuilder response = new StringBuilder();
    List<String> errors = new ArrayList<>();

try {
    // 新增：效能監控開始
    long startTime = System.currentTimeMillis();

    // 收集所有需要的工單號
    Set<String> workOrderNumbers = requests.stream()
        .map(WorkOrderDetailRequest::getWorkOrderNumber)
        .collect(Collectors.toSet());

    System.out.println("要新增的所有的工單號碼如下:" + workOrderNumbers);

    //用於保存實際記錄detail_id數量
    // Map<String, Integer> currentDetailCounts = new HashMap<>();

    // /****************************************** */
    //  // 用於保存已經存在的工單號
    //  Set<String> existingWorkOrderNumbers = new HashSet<>();
    // // 查詢每個工單號是否存在於 WorkOrder 表中
    // for (String workOrderNumber : workOrderNumbers) {
    //   WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(workOrderNumber);

    //   if (workOrder == null) {
    //     // 如果工單號不存在，記錄錯誤並跳過
    //     errors.add("找不到對應的工單: " + workOrderNumber);
    //     continue;
    //   }

    //   // 如果工單號存在，將其加入 existingWorkOrderNumbers 集合
    //   existingWorkOrderNumbers.add(workOrderNumber);
    //   System.out.println("找到工單號並加入集合: " + workOrderNumber);

    //   // ** 新增: 計算當前實際的記錄數量 **
    //   Long currentCount = workOrderDetailRepository.countByWorkOrderNumber(workOrderNumber);
    //   currentDetailCounts.put(workOrderNumber, currentCount.intValue());
    // }

    // /****************************************** */

    // 1122 新增：批次查詢所有工單 **
    Map<String, WorkOrder> workOrderCache = workOrderRepository.findAllByWorkOrderNumberIn(workOrderNumbers)
    .stream()
    .collect(Collectors.toMap(WorkOrder::getWorkOrderNumber, w -> w));

    // ** 新增：批次查詢所有工單的當前記錄數 **
    Map<String, Integer> currentDetailCounts = new HashMap<>();
    workOrderNumbers.forEach(workOrderNumber -> {
        Long count = workOrderDetailRepository.countByWorkOrderNumber(workOrderNumber);
        currentDetailCounts.put(workOrderNumber, count.intValue());
    });


    // 獲取當前每個工單的最大 detailId
    Map<String, Integer> maxDetailIds = workOrderNumbers.stream()
        .collect(Collectors.toMap(
            workOrderNumber -> workOrderNumber,
            workOrderNumber -> {
              Integer maxId = workOrderDetailRepository.findMaxDetailIdByWorkOrderNumber(workOrderNumber);
              return maxId != null ? maxId : 0; // 如果沒有找到，返回 0
            }));

    // API測試
    // System.out.println("Received request: " + requests);
    // logger.info("Received request to process work order detail: {}", requests);

    // ** 新增：準備批量保存的列表 **
    List<WorkOrderDetail> detailsToSave = new ArrayList<>();
    Set<WorkOrder> workOrdersToUpdate = new HashSet<>();

    // 數據驗證
    for (WorkOrderDetailRequest request : requests) {
      try {
        if (request.getWorkOrderNumber() == null || request.getWorkOrderNumber().isEmpty()) {
          errors.add("工單編號不能為空: " + request.getSN());
          continue;
        }

        WorkOrder workOrder = workOrderCache.get(request.getWorkOrderNumber());
        if (workOrder == null) {
            errors.add("找不到對應的工單: " + request.getWorkOrderNumber());
            continue;
        }

        // ** 修改: 使用實際記錄數檢查數量限制 **
        Integer currentCount = currentDetailCounts.get(request.getWorkOrderNumber());
        if (currentCount >= workOrder.getQuantity()) {
            errors.add("工單 " + request.getWorkOrderNumber() + " 的實際記錄數量已達到上限 " + workOrder.getQuantity());
            continue;
        }

        // WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(request.getWorkOrderNumber());

        // 獲取當前 detailId 並檢查是否超過數量限制
        Integer currentDetailId = maxDetailIds.get(request.getWorkOrderNumber());
        int newDetailId = (currentDetailId == null) ? 1 : currentDetailId + 1;

        // ** 更新記錄數量 **
        currentDetailCounts.put(request.getWorkOrderNumber(), currentCount + 1);

        // 更新 maxDetailIds
        maxDetailIds.put(request.getWorkOrderNumber(), newDetailId);

        // 創建WorkOrderDetail實體並保存到數據庫
        WorkOrderDetail workOrderDetail = new WorkOrderDetail();
        workOrderDetail.setWorkOrder(workOrder);
        workOrderDetail.setDetailId(newDetailId); // 設置新的 detailId
        workOrderDetail.setSn(request.getSN());
        workOrderDetail.setQrRfTray(request.getQR_RFTray());
        workOrderDetail.setQrPs(request.getQR_PS());
        workOrderDetail.setQrHs(request.getQR_HS());
        workOrderDetail.setQrRfTrayBedid(request.getQR_RFTray_BEDID());
        workOrderDetail.setQrPsBedid(request.getQR_PS_BEDID());
        workOrderDetail.setQrHsBedid(request.getQR_HS_BEDID());
        workOrderDetail.setQrBackup1(request.getQR_backup1());
        workOrderDetail.setQrBackup2(request.getQR_backup2());
        workOrderDetail.setQrBackup3(request.getQR_backup3());
        workOrderDetail.setQrBackup4(request.getQR_backup4());
        workOrderDetail.setNote(request.getNote());
        workOrderDetail.setCreate_date(LocalDate.now());
        workOrderDetail.setCreate_user(request.getCreate_user());
        workOrderDetail.setEdit_date(LocalDate.now());
        workOrderDetail.setEdit_user(request.getEdit_user());

        // workOrderDetailRepository.save(workOrderDetail);
        // logger.info("Work order detail saved successfully: {}", workOrderDetail);

        // ** 加入批次保存列表，而不是立即保存 **
        detailsToSave.add(workOrderDetail);

        // 更新WorkOrder的相關字段
        workOrder.setEditDate(LocalDate.now());
        workOrder.setEditUser(request.getEdit_user());
        workOrdersToUpdate.add(workOrder);
        // workOrderRepository.save(workOrder);
        // logger.info("Work order updated successfully: {}", workOrder);

        response.append("工單詳細信息已成功處理: ").append(request.getWorkOrderNumber())
            .append(", detailId: ").append(newDetailId)
            .append(", 當前數量: ").append(newDetailId)
            .append("/").append(workOrder.getQuantity())
            .append("\n");
            
          } catch (Exception e) {
            logger.error("Error occurred while processing work order detail", e);
            errors.add("處理工單時發生錯誤: " + request.getWorkOrderNumber() + " - " + e.getMessage());
            continue;  // 繼續處理下一筆
        }
      } 
    
      // ** 新增：批次保存所有資料 **
      if (!detailsToSave.isEmpty()) {
        workOrderDetailRepository.saveAll(detailsToSave);
        workOrderRepository.saveAll(workOrdersToUpdate);
    }

     // ** 新增：記錄處理時間 **
     long endTime = System.currentTimeMillis();
     logger.info("批次處理完成，共處理 {} 筆資料，耗時 {} 毫秒", detailsToSave.size(), (endTime - startTime));

    } catch (Exception e) {
      // 處理其他非工單處理相關的錯誤
        logger.error("Unexpected error occurred", e);
        errors.add("發生未預期的錯誤: " + e.getMessage());
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

  // edit/upadate API
  @PutMapping("/update-work-order-details")
  public ResponseEntity<String> updateWorkOrderDetails(@RequestBody List<UpdateWorkOrderDetailDTO> requests) {
    StringBuilder response = new StringBuilder();
    List<String> errors = new ArrayList<>();

    for (UpdateWorkOrderDetailDTO request : requests) {
      try {
        WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(request.getId()).orElse(null);
        if (workOrderDetail == null) {
          errors.add("找不到ID為 " + request.getId() + " 的工單詳細信息");
          continue;
        }

        // 更新 WorkOrderDetail
        updateWorkOrderDetailFromDTO(workOrderDetail, request);

        workOrderDetailRepository.save(workOrderDetail);

        // 更新對應的 WorkOrder
        updateWorkOrder(workOrderDetail, request.getEdit_user());

        response.append("工單詳細信息已成功更新: ID ").append(request.getId()).append("\n");
      } catch (Exception e) {
        errors.add("更新ID為 " + request.getId() + " 的工單時發生錯誤: " + e.getMessage());
      }
    }

    if (!errors.isEmpty()) {
      response.append("\n錯誤信息:\n");
      errors.forEach(error -> response.append(error).append("\n"));
      return ResponseEntity.badRequest().body(response.toString());
    }

    return ResponseEntity.ok(response.toString());
  }

  private void updateWorkOrderDetailFromDTO(WorkOrderDetail workOrderDetail, UpdateWorkOrderDetailDTO dto) {

    boolean hasUpdates = false;  // 用於追踪是否有任何更新

    if (dto.isFieldSet("SN")) {
      workOrderDetail.setSn(dto.getSn());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_RFTray")) {
      workOrderDetail.setQrRfTray(dto.getQrRfTray());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_PS")) {
      workOrderDetail.setQrPs(dto.getQrPs());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_HS")) {
      workOrderDetail.setQrHs(dto.getQrHs());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_RFTray_BEDID")) {
      workOrderDetail.setQrRfTrayBedid(dto.getQrRfTrayBedid());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_PS_BEDID")) {
      workOrderDetail.setQrPsBedid(dto.getQrPsBedid());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_HS_BEDID")) {
      workOrderDetail.setQrHsBedid(dto.getQrHsBedid()); 
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_backup1")) {
      workOrderDetail.setQrBackup1(dto.getQrBackup1());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_backup2")) {
      workOrderDetail.setQrBackup2(dto.getQrBackup2());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_backup3")) {
      workOrderDetail.setQrBackup3(dto.getQrBackup3());
      hasUpdates = true;
  }
  if (dto.isFieldSet("QR_backup4")) {
      workOrderDetail.setQrBackup4(dto.getQrBackup4());
      hasUpdates = true;
  }
  if (dto.isFieldSet("note")) {
      workOrderDetail.setNote(dto.getNote());
      hasUpdates = true;
  }

     // 只有在有更新時才設置編輯時間和用戶
        if (hasUpdates || dto.isFieldSet("edit_user")) {
          workOrderDetail.setEdit_date(LocalDate.now());
          if (dto.isFieldSet("edit_user")) {
              workOrderDetail.setEdit_user(dto.getEdit_user());
          }
      }
  }

  private void updateWorkOrder(WorkOrderDetail workOrderDetail, String editUser) {
    WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(workOrderDetail.getWorkOrderNumber());
    if (workOrder != null) {
      workOrder.setEditDate(LocalDate.now());
      workOrder.setEditUser(editUser);
      workOrderRepository.save(workOrder);
    }
  }

  // 新增 輸入新 data 時同步檢查用的 put 方法

   @PutMapping("/batch-create-work-order-details")
   @Transactional
   public ResponseEntity<String> batchCreateWorkOrderDetails(@RequestBody List<UpdateWorkOrderDetailDTO> requests) {
       StringBuilder response = new StringBuilder();
       List<String> errors = new ArrayList<>();
   
       // 第一階段：檢查所有數據是否重複
       for (UpdateWorkOrderDetailDTO request : requests) {
           try {
               // 先檢查ID是否存在
               WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(request.getId())
                   .orElseThrow(() -> new RuntimeException("找不到ID為 " + request.getId() + " 的工單詳細信息"));
   
               // 檢查SN重複
               if (request.getSn() != null && !request.getSn().trim().isEmpty()) {
                   if (workOrderDetailRepository.existsBySn(request.getSn())) {
                       errors.add(String.format("SN '%s' 已存在於資料庫中", request.getSn()));
                       continue;
                   }
               }
   
               // 檢查BEDID重複（只在有值時檢查）
               boolean hasAnyBedid = (request.getQrRfTrayBedid() != null && !request.getQrRfTrayBedid().trim().isEmpty()) ||
                                   (request.getQrPsBedid() != null && !request.getQrPsBedid().trim().isEmpty()) ||
                                   (request.getQrHsBedid() != null && !request.getQrHsBedid().trim().isEmpty());
   
               if (hasAnyBedid) {
                   if (workOrderDetailRepository.existsByAnyBedid(
                       request.getQrRfTrayBedid(),
                       request.getQrPsBedid(),
                       request.getQrHsBedid())) {
                       errors.add(String.format("工單號 %s 的以下BEDID已存在：\n" +
                           "RF_Tray_BEDID: %s\n" +
                           "PS_BEDID: %s\n" +
                           "HS_BEDID: %s",
                           workOrderDetail.getWorkOrderNumber(),
                           request.getQrRfTrayBedid(),
                           request.getQrPsBedid(),
                           request.getQrHsBedid()));
                       continue;
                   }
               }
           } catch (Exception e) {
               errors.add("驗證過程發生錯誤: " + e.getMessage());
           }
       }
   
       // 如果有錯誤，返回所有錯誤信息
       if (!errors.isEmpty()) {
           response.append("更新失敗！請檢查以下問題：\n");
           errors.forEach(error -> response.append("- ").append(error).append("\n"));
           return ResponseEntity.badRequest().body(response.toString());
       }
   
       // 第二階段：執行更新
       try {
           for (UpdateWorkOrderDetailDTO request : requests) {
               WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(request.getId())
                   .orElseThrow(() -> new RuntimeException("找不到ID為 " + request.getId() + " 的工單詳細信息"));
               
               updateWorkOrderDetailFromDTO(workOrderDetail, request);
               workOrderDetailRepository.save(workOrderDetail);
   
               // 更新對應的 WorkOrder
               updateWorkOrder(workOrderDetail, request.getEdit_user());
   
               response.append(String.format("成功更新工單號 %s 的詳細信息\n", 
                   workOrderDetail.getWorkOrderNumber()));
           }
   
           return ResponseEntity.ok(response.toString());
   
       } catch (Exception e) {
           throw new RuntimeException("更新過程發生錯誤，請重新檢查後輸入: " + e.getMessage());
       }
   }


  // SN與日期範圍，其餘搜尋API
  @PostMapping("/snfield-search-details")
  public ResponseEntity<List<WorkOrderDetail>> searchWorkOrderDetails(@RequestBody WorkOrderFieldSearchDTO request) {
    logger.info("正在使用SN搜尋的範圍，參數為：{}", request);

    List<WorkOrderDetail> results = searchService.searchWorkOrderDetails(request);

    if (results.isEmpty()) {
      logger.info("搜尋條件為空或無符合條件的結果");
      return ResponseEntity.ok(new ArrayList<>());
  }

    logger.info("搜尋完成。找到 {} 個結果。", results.size());

    return ResponseEntity.ok(results);
  }

  // SN 模糊搜尋 API
  @PostMapping("/snfuzzy-search-details")
  public ResponseEntity<List<WorkOrderDetail>> fuzzySearchWorkOrderDetails(
      @RequestBody WorkOrderDetailFuzzySearchDTO searchCriteria) {
    try {
      // 新增日誌記錄搜尋條件
      logger.info("正在執行模糊搜尋，搜尋條件為：{}", searchCriteria);

      List<WorkOrderDetail> results = searchService.fuzzySearch(searchCriteria);

      // 新增搜尋結果的日誌記錄
      if (results.isEmpty()) {
          logger.info("模糊搜尋無符合條件的結果");
      } else {
          logger.info("模糊搜尋完成，找到 {} 個結果", results.size());
      }

      return ResponseEntity.ok(results);
    } catch (Exception e) {
      logger.error("Error occurred while performing fuzzy search on work order details", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  // DEL API
  @Transactional
  @DeleteMapping("/delete-work-order-details/{id}")
  public ResponseEntity<String> deleteWorkOrderDetail(@PathVariable Long id) {
    try {
      WorkOrderDetail workOrderDetail = workOrderDetailRepository.findById(id).orElse(null);
      
      if (workOrderDetail == null) {
        return ResponseEntity.notFound().build();
      }
      System.out.println("workOrderDetail" + workOrderDetail);
       // ** 新增: 取得工單號供後續使用 **
       String workOrderNumber = workOrderDetail.getWorkOrderNumber();
        
       workOrderDetailRepository.delete(workOrderDetail);

       // ** 新增: 重新編號邏輯 **
       List<WorkOrderDetail> remainingDetails = workOrderDetailRepository
           .findByWorkOrderNumberOrderByDetailId(workOrderNumber);
       
       int newDetailId = 1;
       for (WorkOrderDetail detail : remainingDetails) {
           detail.setDetailId(newDetailId++);
           workOrderDetailRepository.save(detail);
       }

       return ResponseEntity.ok("工單詳細信息已成功刪除並重新編號");

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

  //新增 BEDID*3
  @JsonProperty("QR_RFTray_BEDID")
  private String QR_RFTray_BEDID;

  @JsonProperty("QR_PS_BEDID")
  private String QR_PS_BEDID;

  @JsonProperty("QR_HS_BEDID")
  private String QR_HS_BEDID;

  // 新增一個無參數構造函數
  public WorkOrderDetailRequest() {
  }

  // 新增一個帶參數的構造函數
  public WorkOrderDetailRequest(String workOrderNumber, String SN,
      String QR_RFTray, String QR_PS, String QR_HS,
      String QR_RFTray_BEDID, String QR_PS_BEDID, String QR_HS_BEDID,
      String QR_backup1, String QR_backup2, String QR_backup3,
      String QR_backup4, String note, String create_user, String edit_user) {
    this.workOrderNumber = workOrderNumber;

    this.SN = SN;
    this.QR_RFTray = QR_RFTray;
    this.QR_PS = QR_PS;
    this.QR_HS = QR_HS;
    this.QR_RFTray_BEDID = QR_RFTray_BEDID;  // BEDID
    this.QR_PS_BEDID = QR_PS_BEDID;          
    this.QR_HS_BEDID = QR_HS_BEDID;          
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

  // BEDID 

  public String getQR_RFTray_BEDID() {
    return QR_RFTray_BEDID;
}

public void setQR_RFTray_BEDID(String QR_RFTray_BEDID) {
    this.QR_RFTray_BEDID = QR_RFTray_BEDID;
}

public String getQR_PS_BEDID() {
    return QR_PS_BEDID;
}

public void setQR_PS_BEDID(String QR_PS_BEDID) {
    this.QR_PS_BEDID = QR_PS_BEDID;
}

public String getQR_HS_BEDID() {
    return QR_HS_BEDID;
}

public void setQR_HS_BEDID(String QR_HS_BEDID) {
    this.QR_HS_BEDID = QR_HS_BEDID;
}
}
