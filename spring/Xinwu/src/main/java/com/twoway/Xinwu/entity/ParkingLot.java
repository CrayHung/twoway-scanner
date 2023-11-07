package com.twoway.Xinwu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ParkingLot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String carType="";
    private Integer amount = 100;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCarType(){
        return this.carType;
    }

    public void setCarType(String carType){
        this.carType=carType;
    }


    public Integer getAmount(){
        return this.amount;
    }

    public void setAmount(Integer amount){
        this.amount=amount;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", carType='" + getCarType() + "'" +
                ", amount='" + getAmount() + "'" +
                "}";
    }
    
}
