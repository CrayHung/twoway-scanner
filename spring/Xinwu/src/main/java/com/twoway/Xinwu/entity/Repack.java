package com.twoway.Xinwu.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "repack")
public class Repack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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


    //紀錄是否已完成重新包裝 , 初始狀態為false
    @Column(name = "pack")
    private Boolean pack=false;


    @Column(name = "repack_time")
    private String repackTime;

    //原紙箱名稱
    @Column(name = "carton_name")
    private String cartonName;
    // 新紙箱名稱
    @Column(name = "new_carton_name")
    private String newCartonName;


 public String getCartonName() {
        return this.cartonName;
    }

    public void setCartonName(String cartonName) {
        this.cartonName=cartonName;
    }
    public String getNewCartonName() {
        return this.newCartonName;
    }

    public void setNewCartonName(String newCartonName) {
        this.newCartonName=newCartonName;
    }


    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSn() {
        return this.sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
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

   
    public String getQrRftrayBedid() {
        return this.qrRfTrayBedid;
    }

    public void setQrRftrayBedid(String qrRfTrayBedid) {
        this.qrRfTrayBedid = qrRfTrayBedid;
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

    public String getRepackTime() {
        return this.repackTime;
    }

    public void setRepackTime(String repackTime) {
        this.repackTime = repackTime;
    }

}
