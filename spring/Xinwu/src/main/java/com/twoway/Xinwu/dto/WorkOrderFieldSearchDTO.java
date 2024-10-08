package com.twoway.Xinwu.dto;

// import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkOrderFieldSearchDTO {
  
  private List<String> workOrderNumbers;
    private List<String> snStart;
    private List<String> snEnd;

    @JsonProperty("QR_RFTray")
    private List<String> qrRFTray;

    @JsonProperty("QR_PS")
    private List<String> qrPS;

    @JsonProperty("QR_HS")
    private List<String> qrHS;

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
    


    public List<String> getWorkOrderNumbers() {
      return workOrderNumbers;
    }
    public void setWorkOrderNumbers(List<String> workOrderNumbers) {
      this.workOrderNumbers = workOrderNumbers;
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

  
}
