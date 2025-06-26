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

    //////////////////////////////////////////
    // 新增欄位 : 
    // asn_number
    // cable_operator_known_material_id
    // manufacture_batch_number_or_identifier
    // manufacture_date
    // purchase_order_received_date
    // purchase_order_number
    // shipping_date
    // shipping_company_contractor
    // tracking_number

    @Column(name = "asn_number")
    private String asn_number;
    @Column(name = "cable_operator_known_material_id")
    private String cable_operator_known_material_id;
    @Column(name = "manufacture_batch_number_or_identifier")
    private String manufacture_batch_number_or_identifier;
    @Column(name = "manufacture_country")
    private String manufacture_country;
    @Column(name = "manufacture_date")
    private String manufacture_date;
    @Column(name = "purchase_order_received_date")
    private String purchase_order_received_date;
    @Column(name = "purchase_order_number")
    private String purchase_order_number;
    @Column(name = "shipping_date")
    private String shipping_date;
    @Column(name = "shipping_company_contractor")
    private String shipping_company_contractor;
    @Column(name = "tracking_number")
    private String tracking_number;

    @Column(name = "customer")
    private String customer;



    public String getAsnNumber() {
        return this.asn_number;
    }

    public void setAsnNumber(String asn_number) {
        this.asn_number = asn_number;
    }
    public String getcable_operator_known_material_id() {
        return this.cable_operator_known_material_id;
    }

    public void setcable_operator_known_material_id(String cable_operator_known_material_id) {
        this.cable_operator_known_material_id = cable_operator_known_material_id;
    }
    public String getmanufacture_batch_number_or_identifier() {
        return this.manufacture_batch_number_or_identifier;
    }

    public void setmanufacture_batch_number_or_identifier(String manufacture_batch_number_or_identifier) {
        this.manufacture_batch_number_or_identifier = manufacture_batch_number_or_identifier;
    }

    public String getmanufacture_country() {
        return this.manufacture_country;
    }

    public void setmanufacture_country(String manufacture_country) {
        this.manufacture_country = manufacture_country;
    }


    public String getmanufacture_date() {
        return this.palletName;
    }

    public void setmanufacture_date(String manufacture_date) {
        this.manufacture_date = manufacture_date;
    }

    public String getpurchase_order_received_date() {
        return this.purchase_order_received_date;
    }

    public void setpurchase_order_received_date(String purchase_order_received_date) {
        this.purchase_order_received_date = purchase_order_received_date;
    }
    
    public String getpurchase_order_number() {
        return this.purchase_order_number;
    }

    public void setpurchase_order_number(String purchase_order_number) {
        this.purchase_order_number = purchase_order_number;
    }
    
    public String getshipping_date() {
        return this.palletName;
    }

    public void setshipping_date(String shipping_date) {
        this.shipping_date = shipping_date;
    }
    
    public String getshipping_company_contractor() {
        return this.shipping_company_contractor;
    }

    public void setshipping_company_contractor(String shipping_company_contractor) {
        this.shipping_company_contractor = shipping_company_contractor;
    }
    
    public String gettracking_number() {
        return this.tracking_number;
    }

    public void settracking_number(String tracking_number) {
        this.tracking_number = tracking_number;
    }

    public String getcustomer() {
        return this.customer;
    }

    public void setcustomer(String customer) {
        this.customer = customer;
    }



  ////////////////////////////////////////////


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
