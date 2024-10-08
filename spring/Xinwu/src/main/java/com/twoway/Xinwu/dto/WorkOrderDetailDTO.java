package com.twoway.Xinwu.dto;
import java.util.List;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkOrderDetailDTO {

    @JsonProperty("SN")
    private List<String> sn;

    @JsonProperty("QR_RFTray")
    private List<String> qrRfTray;

    @JsonProperty("QR_PS")
    private List<String> qrPs;

    @JsonProperty("QR_HS")
    private List<String> qrHs;

    @JsonProperty("QR_backup1")
    private List<String> qrBackup1;

    @JsonProperty("QR_backup2")
    private List<String> qrBackup2;

    @JsonProperty("QR_backup3")
    private List<String> qrBackup3;

    @JsonProperty("QR_backup4")
    private List<String> qrBackup4;

    private List<String> note;
    private List<String> create_user;
    private List<String> edit_user;
    private List<String> detail_id;

    private List<String> workOrderNumber;
    private List<String> partNumber;
    private List<String> company;
    private List<String> quantity;

      @JsonProperty("productionDateStart")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> productionDateStart;

    @JsonProperty("productionDateEnd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> productionDateEnd;
    
    @JsonProperty("SN")
    public List<String> getSn() {
      return sn;
    }

    @JsonProperty("SN")
    public void setSn(List<String> sn) {
      this.sn = sn;
    }

    @JsonProperty("QR_RFTray")
    public List<String> getQrRfTray() {
        return qrRfTray;
    }

    @JsonProperty("QR_RFTray")
    public void setQrRfTray(List<String> qrRfTray) {
        this.qrRfTray = qrRfTray;
    }

    @JsonProperty("QR_PS")
    public List<String> getQrPs() {
        return qrPs;
    }

   @JsonProperty("QR_PS")
    public void setQrPs(List<String> qrPs) {
        this.qrPs = qrPs;
    }

    @JsonProperty("QR_HS")
    public List<String> getQrHs() {
        return qrHs;
    }

    @JsonProperty("QR_HS")
    public void setQrHs(List<String> qrHs) {
        this.qrHs = qrHs;
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

    public List<String> getWorkOrderNumber() {
      return workOrderNumber;
    }
    public void setWorkOrderNumber(List<String> workOrderNumber) {
      this.workOrderNumber = workOrderNumber;
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

    
}
