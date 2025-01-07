package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PalletDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String palletName;

    private String workOrderNumber;
    private String sn;
    private String qrRftrayBedid;
    private String qrPsBedid;
    private String qrHsBedid;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public String getPalletName() {
        return this.palletName;
    }

    public void setPalletName(String palletName) {
        this.palletName=palletName;
    }

    public String getWorkOrderNumber() {
        return this.workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber=workOrderNumber;
    }
    public String getSn() {
        return this.sn;
    }

    public void setSn(String sn) {
        this.sn=sn;
    }
    public String getQrRftrayBedid() {
        return this.qrRftrayBedid;
    }

    public void setQrRftrayBedid(String qrRftrayBedid) {
        this.qrRftrayBedid=qrRftrayBedid;
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
