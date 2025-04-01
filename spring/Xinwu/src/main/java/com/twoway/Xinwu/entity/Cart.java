package com.twoway.Xinwu.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

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
    
        @Column(name = "added_time")
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
    
        public String getAddedTime() {
            return this.addedTime;
        }
    
        public void setAddedTime(String addedTime) {
            this.addedTime = addedTime;
        }

        
    }