package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "work_order_details")
public class WorkOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "detail_id")
    private Integer detail_id;

    @Column(name = "SN")
    private String SN;
    
    @Column(name = "qr_rf_tray")
    private String QR_RFTray;
    
    @Column(name = "qr_ps")
    private String QR_PS;

    @Column(name = "qr_hs")
    private String QR_HS;

    @Column(name = "qr_backup1")
    private String QR_backup1;

    @Column(name = "qr_backup2")
    private String QR_backup2;

    @Column(name = "qr_backup3")
    private String QR_backup3;

    @Column(name = "qr_backup4")
    private String QR_backup4;

    @Column(name = "note")
    private String note;

    @Column(name = "create_date")
    private LocalDate create_date;

    @Column(name = "create_user")
    private String create_user;

    @Column(name = "edit_date")
    private LocalDate edit_date;

    @Column(name = "edit_user")
    private String edit_user;

    // parent workorder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_number", referencedColumnName = "work_order_number")
    @JsonBackReference
    private WorkOrder workOrder;

    // Getters and setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDetail_id() {
        return detail_id;
    }

    public void setDetail_id(Integer detail_id) {
        this.detail_id = detail_id;
    }

    public String getSn() {
        return SN;
    }

    public void setSn(String SN) {
        this.SN = SN;
    }

    public String getQR_RFTray() {
        return QR_RFTray;
    }

    public void setQR_RFTray(String QR_RFTray) {
        this.QR_RFTray = QR_RFTray;
    }

    public String getQR_PS() {
        return QR_PS;
    }

    public void setQR_PS(String QR_PS) {
        this.QR_PS = QR_PS;
    }

    public String getQR_HS() {
        return QR_HS;
    }

    public void setQR_HS(String QR_HS) {
        this.QR_HS = QR_HS;
    }

    public String getQR_backup1() {
        return QR_backup1;
    }

    public void setQR_backup1(String QR_backup1) {
        this.QR_backup1 = QR_backup1;
    }

    public String getQR_backup2() {
        return QR_backup2;
    }

    public void setQR_backup2(String QR_backup2) {
        this.QR_backup2 = QR_backup2;
    }

    public String getQR_backup3() {
        return QR_backup3;
    }

    public void setQR_backup3(String QR_backup3) {
        this.QR_backup3 = QR_backup3;
    }

    public String getQR_backup4() {
        return QR_backup4;
    }

    public void setQR_backup4(String QR_backup4) {
        this.QR_backup4 = QR_backup4;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getCreate_date() {
        return create_date;
    }

    public void setCreate_date(LocalDate create_date) {
        this.create_date = create_date;
    }

    public String getCreate_user() {
        return create_user;
    }

    public void setCreate_user(String create_user) {
        this.create_user = create_user;
    }

    public LocalDate getEdit_date() {
        return edit_date;
    }

    public void setEdit_date(LocalDate edit_date) {
        this.edit_date = edit_date;
    }

    public String getEdit_user() {
        return edit_user;
    }

    public void setEdit_user(String edit_user) {
        this.edit_user = edit_user;
    }

    // Parent 類別的 WorkOrder 設定
    public WorkOrder getWorkOrder() {
        return workOrder;
    }

    public void setWorkOrder(WorkOrder workOrder) {
        this.workOrder = workOrder;
    }

     // Add a method to get parent WorkOrder properties
     @Transient
    public String getParentWorkOrderNumber() {
        return workOrder != null ? workOrder.getWorkOrderNumber() : null;
    }

    @Transient
    public int getParentQuantity() {
        return workOrder != null ? workOrder.getQuantity() : 0;
    }

    @Transient
    public String getParentPartNumber() {
        return workOrder != null ? workOrder.getPartNumber() : null;
    }
    
    @Transient
    public String getParentCompany() {
        return workOrder != null ? workOrder.getCompany() : null;
    }
}