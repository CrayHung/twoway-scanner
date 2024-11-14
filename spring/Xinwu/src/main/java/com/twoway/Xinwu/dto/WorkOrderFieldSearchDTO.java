package com.twoway.Xinwu.dto;

// import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkOrderFieldSearchDTO {
  
  private List<String> workOrderNumber;
    private List<String> snStart;
    private List<String> snEnd;

    @JsonProperty("QR_RFTray")
    private List<String> qrRFTray;

    @JsonProperty("QR_PS")
    private List<String> qrPS;

    @JsonProperty("QR_HS")
    private List<String> qrHS;

    // 新增三個 BEDID 字段
    @JsonProperty("QR_RFTray_BEDID")
    private List<String> qrRFTrayBedid;

    @JsonProperty("QR_PS_BEDID")
    private List<String> qrPSBedid;

    @JsonProperty("QR_HS_BEDID")
    private List<String> qrHSBedid;

    @JsonProperty("QR_backup1")
    private List<String> qrBackup1;

    @JsonProperty("QR_backup2")
    private List<String> qrBackup2;

    @JsonProperty("QR_backup3")
    private List<String> qrBackup3;

    @JsonProperty("QR_backup4")
    private List<String> qrBackup4;

    @JsonProperty("productionDateStart")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> productionDateStart;

    @JsonProperty("productionDateEnd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> productionDateEnd;

    private List<String> note;
    private List<String> create_user;
    private List<String> edit_user;
    private List<String> detail_id;
    private List<String> partNumber;
    private List<String> company;
    private List<String> quantity;
    


    public List<String> getWorkOrderNumber() {
      return workOrderNumber;
    }
    public void setWorkOrderNumber(List<String> workOrderNumbers) {
      this.workOrderNumber = workOrderNumbers;
    }

    public List<String> getSnStart() {
      return snStart;
    }
    public void setSnStart(List<String> snStart) {
      this.snStart = snStart;
    }

    public List<String> getSnEnd() {
      return snEnd;
    }
    public void setSnEnd(List<String> snEnd) {
      this.snEnd = snEnd;
    }

     @JsonProperty("QR_RFTray")
    public List<String> getQrRFTray() {
        return qrRFTray;
    }

    @JsonProperty("QR_RFTray")
    public void setQrRFTray(List<String> qrRFTray) {
        this.qrRFTray = qrRFTray;
    }

    @JsonProperty("QR_PS")
    public List<String> getQrPS() {
        return qrPS;
    }

    @JsonProperty("QR_PS")
    public void setQrPS(List<String> qrPS) {
        this.qrPS = qrPS;
    }

    @JsonProperty("QR_HS")
    public List<String> getQrHS() {
        return qrHS;
    }

    @JsonProperty("QR_HS")
    public void setQrHS(List<String> qrHS) {
        this.qrHS = qrHS;
    }

    @JsonProperty("QR_backup1")
    public List<String> getQrBackup1() {
        return qrBackup1;
    }

    @JsonProperty("QR_backup1")
    public void setQrBackup1(List<String> qrBackup1) {
        this.qrBackup1 = qrBackup1;
    }

    @JsonProperty("QR_backup2")
    public List<String> getQrBackup2() {
        return qrBackup2;
    }

    @JsonProperty("QR_backup2")
    public void setQrBackup2(List<String> qrBackup2) {
        this.qrBackup2 = qrBackup2;
    }

    @JsonProperty("QR_backup3")
    public List<String> getQrBackup3() {
        return qrBackup3;
    }

    @JsonProperty("QR_backup3")
    public void setQrBackup3(List<String> qrBackup3) {
        this.qrBackup3 = qrBackup3;
    }

    @JsonProperty("QR_backup4")
    public List<String> getQrBackup4() {
        return qrBackup4;
    }

    @JsonProperty("QR_backup4")
    public void setQrBackup4(List<String> qrBackup4) {
        this.qrBackup4 = qrBackup4;
    }

    public List<LocalDate> getProductionDateStart() {
      return productionDateStart;
    }
    public void setProductionDateStart(List<LocalDate> productionDateStart) {
      this.productionDateStart = productionDateStart;
    }

    public List<LocalDate> getProductionDateEnd() {
      return productionDateEnd;
    }
    public void setProductionDateEnd(List<LocalDate> productionDateEnd) {
      this.productionDateEnd = productionDateEnd;
    }


    // 補上未有特殊字樣的項目
        public List<String> getNote() {
          return note;
      }

      public void setNote(List<String> note) {
          this.note = note;
      }

      public List<String> getCreate_user() {
          return create_user;
      }

      public void setCreate_user(List<String> create_user) {
          this.create_user = create_user;
      }

      public List<String> getEdit_user() {
          return edit_user;
      }

      public void setEdit_user(List<String> edit_user) {
          this.edit_user = edit_user;
      }

      public List<String> getDetail_id() {
          return detail_id;
      }

      public void setDetail_id(List<String> detail_id) {
          this.detail_id = detail_id;
      }

      public List<String> getPartNumber() {
          return partNumber;
      }

      public void setPartNumber(List<String> partNumber) {
          this.partNumber = partNumber;
      }

      public List<String> getCompany() {
          return company;
      }

      public void setCompany(List<String> company) {
          this.company = company;
      }

      public List<String> getQuantity() {
          return quantity;
      }

      public void setQuantity(List<String> quantity) {
          this.quantity = quantity;
      }
      
      // 新增 BEDID 字段的 getter/setter
    @JsonProperty("QR_RFTray_BEDID")
    public List<String> getQrRFTrayBedid() {
        return qrRFTrayBedid;
    }

    @JsonProperty("QR_RFTray_BEDID")
    public void setQrRFTrayBedid(List<String> qrRFTrayBedid) {
        this.qrRFTrayBedid = qrRFTrayBedid;
    }

    @JsonProperty("QR_PS_BEDID")
    public List<String> getQrPSBedid() {
        return qrPSBedid;
    }

    @JsonProperty("QR_PS_BEDID")
    public void setQrPSBedid(List<String> qrPSBedid) {
        this.qrPSBedid = qrPSBedid;
    }

    @JsonProperty("QR_HS_BEDID")
    public List<String> getQrHSBedid() {
        return qrHSBedid;
    }

    @JsonProperty("QR_HS_BEDID")
    public void setQrHSBedid(List<String> qrHSBedid) {
        this.qrHSBedid = qrHSBedid;
    }
}
