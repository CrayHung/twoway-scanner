package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "work_order_details")
public class WorkOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(name = "detail_id")
    private Integer detailId;


    @Column(name = "sn")
    private String sn;
    

    @Column(name = "qr_rf_tray")
    private String qrRfTray;
    
 
    @Column(name = "qr_ps")
    private String qrPs;


    @Column(name = "qr_hs")
    private String qrHs;


    @Column(name = "qr_backup1")
    private String qrBackup1;


    @Column(name = "qr_backup2")
    private String qrBackup2;

    
    @Column(name = "qr_backup3")
    private String qrBackup3;

    
    @Column(name = "qr_backup4")
    private String qrBackup4;

    
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

    @Column(name = "carton_name")
    private String cartonName;

    // 建立 work_order_number 為關聯第一層與第二層表單的項目
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_number", referencedColumnName = "work_order_number")
    @JsonBackReference
    private WorkOrder workOrder;

    //新增BEDID欄位

    @Column(name = "qr_rf_tray_bedid")
    private String qrRfTrayBedid;

    @Column(name = "qr_ps_bedid")
    private String qrPsBedid;

    @Column(name = "qr_hs_bedid")
    private String qrHsBedid;

    // Getters and setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDetailId() {
        return detailId;
    }

    public void setDetailId(Integer detailId) {
        this.detailId = detailId;
    }

    @JsonProperty("SN")
    public String getSn() {
        return sn;
    }

    @JsonProperty("SN")
    public void setSn(String sn) {
        this.sn = sn;
    }

    @JsonProperty("QR_RFTray")
    public String getQrRfTray() {
        return qrRfTray;
    }

    @JsonProperty("QR_RFTray")
    public void setQrRfTray(String qrRfTray) {
        this.qrRfTray = qrRfTray;
    }

    @JsonProperty("QR_PS")
    public String getQrPs() {
        return qrPs;
    }

    @JsonProperty("QR_PS")
    public void setQrPs(String qrPs) {
        this.qrPs = qrPs;
    }

    @JsonProperty("QR_HS")
    public String getQrHs() {
        return qrHs;
    }

    @JsonProperty("QR_HS")
    public void setQrHs(String qrHs) {
        this.qrHs = qrHs;
    }

        
    public String getCartonName() {
        return cartonName;
    }

    public void setCartonName(String cartonName) {
        this.cartonName = cartonName;
    }
    
    
    @JsonProperty("QR_backup1")
    public String getQrBackup1() {
        return qrBackup1;
    }

    @JsonProperty("QR_backup1")
    public void setQrBackup1(String qrBackup1) {
        this.qrBackup1 = qrBackup1;
    }

    @JsonProperty("QR_backup2")
    public String getQrBackup2() {
        return qrBackup2;
    }

    @JsonProperty("QR_backup2")
    public void setQrBackup2(String qrBackup2) {
        this.qrBackup2 = qrBackup2;
    }

    @JsonProperty("QR_backup3")
    public String getQrBackup3() {
        return qrBackup3;
    }

    @JsonProperty("QR_backup3")
    public void setQrBackup3(String qrBackup3) {
        this.qrBackup3 = qrBackup3;
    }

    @JsonProperty("QR_backup4")
    public String getQrBackup4() {
        return qrBackup4;
    }

    @JsonProperty("QR_backup4")
    public void setQrBackup4(String qrBackup4) {
        this.qrBackup4 = qrBackup4;
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
    public String getWorkOrderNumber() {
        return workOrder != null ? workOrder.getWorkOrderNumber() : null;
    }

    
    @Transient
    public int getQuantity() {
        return workOrder != null ? workOrder.getQuantity() : 0;
    }

    
    @Transient
    public String getPartNumber() {
        return workOrder != null ? workOrder.getPartNumber() : null;
    }
    
    
    @Transient
    public String getCompany() {
        return workOrder != null ? workOrder.getCompany() : null;
    }

    // 當更動 workOrdernumber 時
    public void updateWorkOrderNumber(String newWorkOrderNumber) {
        // This method will be called by WorkOrder when its work order number changes
        // You don't need to update the workOrder reference here, as it will be updated by the parent
    }

    //新增 BEDID getter / setter

    @JsonProperty("QR_RFTray_BEDID")
    public String getQrRfTrayBedid() {
        return qrRfTrayBedid;
    }

    @JsonProperty("QR_RFTray_BEDID")
    public void setQrRfTrayBedid(String qrRfTrayBedid) {
        this.qrRfTrayBedid = qrRfTrayBedid;
    }

    @JsonProperty("QR_PS_BEDID")
    public String getQrPsBedid() {
        return qrPsBedid;
    }

    @JsonProperty("QR_PS_BEDID")
    public void setQrPsBedid(String qrPsBedid) {
        this.qrPsBedid = qrPsBedid;
    }

    @JsonProperty("QR_HS_BEDID")
    public String getQrHsBedid() {
        return qrHsBedid;
    }

    @JsonProperty("QR_HS_BEDID")
    public void setQrHsBedid(String qrHsBedid) {
        this.qrHsBedid = qrHsBedid;
    }
}