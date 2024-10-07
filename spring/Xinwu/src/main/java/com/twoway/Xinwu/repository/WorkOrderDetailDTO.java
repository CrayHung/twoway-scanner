package com.twoway.Xinwu.repository;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkOrderDetailDTO {

    @JsonProperty("SN")
    private List<String> sn;
    private List<String> QR_RFTray;
    private List<String> QR_PS;
    private List<String> QR_HS;
    private List<String> QR_backup1;
    private List<String> QR_backup2;
    private List<String> QR_backup3;
    private List<String> QR_backup4;
    private List<String> note;
    private List<String> create_user;
    private List<String> edit_user;
    private List<String> detail_id;
    private List<String> create_date;
    private List<String> edit_date;
    private List<String> workOrderNumber;
    private List<String> partNumber;
    private List<String> company;
    private List<String> quantity;
    
    @JsonProperty("SN")
    public List<String> getSn() {
      return sn;
    }

    @JsonProperty("SN")
    public void setSn(List<String> sn) {
      this.sn = sn;
    }
    public List<String> getQR_RFTray() {
      return QR_RFTray;
    }
    public void setQR_RFTray(List<String> qR_RFTray) {
      QR_RFTray = qR_RFTray;
    }
    public List<String> getQR_PS() {
      return QR_PS;
    }
    public void setQR_PS(List<String> qR_PS) {
      QR_PS = qR_PS;
    }
    public List<String> getQR_HS() {
      return QR_HS;
    }
    public void setQR_HS(List<String> qR_HS) {
      QR_HS = qR_HS;
    }
    public List<String> getQR_backup1() {
      return QR_backup1;
    }
    public void setQR_backup1(List<String> qR_backup1) {
      QR_backup1 = qR_backup1;
    }
    public List<String> getQR_backup2() {
      return QR_backup2;
    }
    public void setQR_backup2(List<String> qR_backup2) {
      QR_backup2 = qR_backup2;
    }
    public List<String> getQR_backup3() {
      return QR_backup3;
    }
    public void setQR_backup3(List<String> qR_backup3) {
      QR_backup3 = qR_backup3;
    }
    public List<String> getQR_backup4() {
      return QR_backup4;
    }
    public void setQR_backup4(List<String> qR_backup4) {
      QR_backup4 = qR_backup4;
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
    public List<String> getCreate_date() {
      return create_date;
    }
    public void setCreate_date(List<String> create_date) {
      this.create_date = create_date;
    }
    public List<String> getEdit_date() {
      return edit_date;
    }
    public void setEdit_date(List<String> edit_date) {
      this.edit_date = edit_date;
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


    
}
