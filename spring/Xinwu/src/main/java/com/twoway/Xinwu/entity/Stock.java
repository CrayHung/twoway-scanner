package com.twoway.Xinwu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stock")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "pallet_name")
    private String palletName;
    @Column(name = "stock_time")
    private String stockTime;

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


    public String getStockTime() {
        return this.stockTime;
    }

    public void setStockTime(String stockTime) {
        this.stockTime = stockTime;
    }


}
