package com.twoway.Xinwu.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart")
public class Cart {
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
    
        @Column(name = "qr_rf_Tray_bedid")
        private String qrRfTrayBedid;
    
        @Column(name = "qr_ps_bedid")
        private String qrPsBedid;
    
        @Column(name = "qr_hs_bedid")
        private String qrHsBedid;
    
        @Column(name = "added_time")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private String addedTime;


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
    
        public String getAddedTime() {
            return this.addedTime;
        }
    
        public void setAddedTime(String addedTime) {
            this.addedTime = addedTime;
        }

        
    }