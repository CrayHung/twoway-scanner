package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "carton_detail")
public class CartonDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pallet_name")
    private String palletName;
    @Column(name = "carton_name")
    private String cartonName;
    @Column(name = "sn")
    private String sn;

    @Column(name = "qr_rf_tray")
    private String qrRfTray;
    @Column(name = "qr_ps")
    private String qrPs;
    @Column(name = "qr_hs")
    private String qrHs;

    @Column(name = "qr_rf_tray_bedid")
    private String qrRfTrayBedid;
    @Column(name = "qr_ps_bedid")
    private String qrPsBedid;
    @Column(name = "qr_hs_bedid")
    private String qrHsBedid;


    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id=id;
    }

    public String getPalletName() {
        return this.palletName;
    }

    public void setPalletName(String palletName) {
        this.palletName=palletName;
    }

    public String getCartonName() {
        return this.cartonName;
    }

    public void setCartonName(String cartonName) {
        this.cartonName=cartonName;
    }
    public String getSn() {
        return this.sn;
    }

    public void setSn(String sn) {
        this.sn=sn;
    }

    public String getQrRfTray() {
        return this.qrRfTray;
    }

    public void setQrRfTray(String qrRfTray) {
        this.qrRfTray = qrRfTray;
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
    
    public String getQrRfTrayBedid() {
        return this.qrRfTrayBedid;
    }

    public void setQrRfTrayBedid(String qrRfTrayBedid) {
        this.qrRfTrayBedid=qrRfTrayBedid;
    }
    public String getQrPsBedid() {
        return this.qrPsBedid;
    }

    public void setQrPsBedid(String qrPsBedid) {
        this.qrPsBedid=qrPsBedid;
    }

    public String getQrHsBedid() {
        return this.qrHsBedid;
    }

    public void setQrHsBedid(String qrHsBedid) {
        this.qrHsBedid=qrHsBedid;
    }
    
}
