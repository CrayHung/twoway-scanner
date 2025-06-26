package com.twoway.Xinwu.dto;

public class CartToShippedDTO {
    private Integer id;
    private String palletName;
    private String cartonName;
    private String sn;
    private String qrRftray;
    private String qrPs;
    private String qrHs;
    private String qrRftrayBedid;
    private String qrPsBedid;
    private String qrHsBedid;
    private String shippedTime;

    private String asn_number;
    private String cable_operator_known_material_id;
    private String manufacture_batch_number_or_identifier;
    private String manufacture_country;
    private String manufacture_date;
    private String purchase_order_received_date;
    private String purchase_order_number;
    private String shipping_date;
    private String shipping_company_contractor;
    private String tracking_number;
    private String customer;


    public Integer getId() {
        return id;
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
        return this.qrRftray;
    }

    public void setQrRfTray(String qrRftray) {
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

    public String getQrRfTrayBedid() {
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




    //新增欄位
    public String getShippedTime() {
        return this.shippedTime;
    }

    public void setShippedTime(String shippedTime) {
        this.shippedTime = shippedTime;
    }

    public String getasn_number() {
        return this.asn_number;
    }

    public void seasn_number(String asn_number) {
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
        return this.manufacture_date;
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
        return this.shipping_date;
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





}
