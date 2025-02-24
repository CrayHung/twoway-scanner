package com.twoway.Xinwu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "shipped")
public class Shipped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pallet_name")
    private String palletName;
    @Column(name = "carton_name")
    private String cartonName;
    @Column(name = "sn")
    private String sn;

    @Column(name = "qr_rftray")
    private String qrRftray;
    @Column(name = "qr_ps")
    private String qrPs;
    @Column(name = "qr_hs")
    private String qrHs;

    @Column(name = "qr_rftray_bedid")
    private String qrRftrayBedid;
    @Column(name = "qr_ps_bedid")
    private String qrPsBedid;
    @Column(name = "qr_hs_bedid")
    private String qrHsBedid;

    @Column(name = "shipped_time")
    private String shippedTime;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPalletName() {
        return this.palletName;
    }

    public void setPalletName(String palletName) {
        this.palletName = palletName;
    }

    public String getCartonName() {
        return this.cartonName;
    }

    public void setCartonName(String cartonName) {
        this.cartonName = cartonName;
    }

    public String getSn() {
        return this.sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getQrRftray() {
        return this.qrRftray;
    }

    public void setQrRftray(String qrRftray) {
        this.qrRftray = qrRftray;
    }

    public String getQrPs() {
        return this.qrPs;
    }

    public void setQrPs(String qrPs) {
        this.qrPs = qrPs;
    }

    public String getQrHs() {
        return this.qrHs;
    }

    public void setQrHs(String qrHs) {
        this.qrHs = qrHs;
    }

    public String getQrRftrayBedid() {
        return this.qrRftrayBedid;
    }

    public void setQrRftrayBedid(String qrRftrayBedid) {
        this.qrRftrayBedid = qrRftrayBedid;
    }

    public String getQrPsBedid() {
        return this.qrPsBedid;
    }

    public void setQrPsBedid(String qrPsBedid) {
        this.qrPsBedid = qrPsBedid;
    }

    public String getQrHsBedid() {
        return this.qrHsBedid;
    }

    public void setQrHsBedid(String qrHsBedid) {
        this.qrHsBedid = qrHsBedid;
    }

    public String getShippedTime() {
        return this.shippedTime;
    }

    public void setShippedTime(String shippedTime) {
        this.shippedTime = shippedTime;
    }

}
