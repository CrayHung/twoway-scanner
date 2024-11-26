package com.twoway.Xinwu.dto;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateWorkOrderDetailDTO {
    private Long id;
    private transient Set<String> fieldsSet = new HashSet<>();

    @JsonProperty("SN")
    private String sn;

    @JsonProperty("QR_RFTray")
    private String qrRfTray;

    @JsonProperty("QR_PS")
    private String qrPs;

    @JsonProperty("QR_HS")
    private String qrHs;

    // 新增三個 BEDID 字段
    @JsonProperty("QR_RFTray_BEDID")
    private String qrRfTrayBedid;

    @JsonProperty("QR_PS_BEDID")
    private String qrPsBedid;

    @JsonProperty("QR_HS_BEDID")
    private String qrHsBedid;

    @JsonProperty("QR_backup1")
    private String qrBackup1;

    @JsonProperty("QR_backup2")
    private String qrBackup2;

    @JsonProperty("QR_backup3")
    private String qrBackup3;

    @JsonProperty("QR_backup4")
    private String qrBackup4;

    private String note;
    private String edit_user;


    @JsonAnySetter
    public void handleUnknown(String key, Object value) {
        fieldsSet.add(key);
    }

// Getters and setters
  public Long getId() {
      return id;
  }

  public void setId(Long id) {
      this.id = id;
      fieldsSet.add("id");
  }

  public String getSn() {
      return sn;
  }

  @JsonProperty("SN")
  public void setSn(String sn) {
      this.sn = sn;
      fieldsSet.add("SN");
  }

  public String getQrRfTray() {
      return qrRfTray;
  }

  @JsonProperty("QR_RFTray")
  public void setQrRfTray(String qrRfTray) {
      this.qrRfTray = qrRfTray;
      fieldsSet.add("QR_RFTray");
  }

  public String getQrPs() {
      return qrPs;
  }

  @JsonProperty("QR_PS")
  public void setQrPs(String qrPs) {
      this.qrPs = qrPs;
      fieldsSet.add("QR_PS");
  }

  public String getQrHs() {
      return qrHs;
  }

  @JsonProperty("QR_HS")
  public void setQrHs(String qrHs) {
      this.qrHs = qrHs;
      fieldsSet.add("QR_HS");
  }

  public String getQrRfTrayBedid() {
      return qrRfTrayBedid;
  }

  @JsonProperty("QR_RFTray_BEDID")
  public void setQrRfTrayBedid(String qrRfTrayBedid) {
      this.qrRfTrayBedid = qrRfTrayBedid;
      fieldsSet.add("QR_RFTray_BEDID");
  }

  public String getQrPsBedid() {
      return qrPsBedid;
  }

  @JsonProperty("QR_PS_BEDID")
  public void setQrPsBedid(String qrPsBedid) {
      this.qrPsBedid = qrPsBedid;
      fieldsSet.add("QR_PS_BEDID");
  }

  public String getQrHsBedid() {
      return qrHsBedid;
  }

  @JsonProperty("QR_HS_BEDID")
  public void setQrHsBedid(String qrHsBedid) {
      this.qrHsBedid = qrHsBedid;
      fieldsSet.add("QR_HS_BEDID");
  }

  public String getQrBackup1() {
      return qrBackup1;
  }

  @JsonProperty("QR_backup1")
  public void setQrBackup1(String qrBackup1) {
      this.qrBackup1 = qrBackup1;
      fieldsSet.add("QR_backup1");
  }

  public String getQrBackup2() {
      return qrBackup2;
  }

  @JsonProperty("QR_backup2")
  public void setQrBackup2(String qrBackup2) {
      this.qrBackup2 = qrBackup2;
      fieldsSet.add("QR_backup2");
  }

  public String getQrBackup3() {
      return qrBackup3;
  }

  @JsonProperty("QR_backup3")
  public void setQrBackup3(String qrBackup3) {
      this.qrBackup3 = qrBackup3;
      fieldsSet.add("QR_backup3");
  }

  public String getQrBackup4() {
      return qrBackup4;
  }

  @JsonProperty("QR_backup4")
  public void setQrBackup4(String qrBackup4) {
      this.qrBackup4 = qrBackup4;
      fieldsSet.add("QR_backup4");
  }

  public String getNote() {
      return note;
  }

  public void setNote(String note) {
      this.note = note;
      fieldsSet.add("note");
  }

  public String getEdit_user() {
      return edit_user;
  }

  public void setEdit_user(String edit_user) {
      this.edit_user = edit_user;
      fieldsSet.add("edit_user");
  }

  public boolean isFieldSet(String fieldName) {
      return fieldsSet.contains(fieldName);
  }
  
  public Set<String> getFieldsSet() {
    return fieldsSet;
}
}
