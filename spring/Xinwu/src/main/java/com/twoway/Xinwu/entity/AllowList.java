package com.twoway.Xinwu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AllowList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String plateNumber = "";
    private String passStatus = "";
    private String visitorStartStr = "";
    private String visitorEndStr = "";


    public String getPassStatus() {
        return this.passStatus;
      }
    
      public void setPassStatus(String passStatus) {
        this.passStatus = passStatus;
      }
    public String getVisitorStartStr() {
        return this.visitorStartStr;
    }

    public void setVisitorStartStr(String visitorStartStr) {
        this.visitorStartStr = visitorStartStr;
    }

    public String getVisitorEndStr() {
        return this.visitorEndStr;
    }

    public void setVisitorEndStr(String visitorEndStr) {
        this.visitorEndStr = visitorEndStr;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPlateNumber() {
        return this.plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", passStatus='" + getPassStatus() + "'" +
                ", plateNumber='" + getPlateNumber() + "'" +
                ", visitorStartStr='" + getVisitorStartStr() + "'" +
                ", visitorEndStr='" + getVisitorEndStr() + "'" +
                "}";
    }
}
