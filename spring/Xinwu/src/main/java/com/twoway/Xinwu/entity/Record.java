package com.twoway.Xinwu.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Record{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String plateNumber = "";
    private LocalDateTime recognitionTime;
    private String recognitionTimeStr = "";
    private String passStatus = "";
    private String imagePath = "";
    private String cameraId = "";
  
    private String name = "";
    private String vehicleType = "";

    public String getCameraId() {
        return this.cameraId;
      }
    
      public void setCameraId(String cameraId) {
        this.cameraId = cameraId;
      }
    
      public String getImagePath() {
        return this.imagePath;
      }
    
      public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
      }
    
      public String getRecognitionTimeStr() {
        return this.recognitionTimeStr;
      }
    
      public void setRecognitionTimeStr(String recognitionTimeStr) {
        this.recognitionTimeStr = recognitionTimeStr;
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
    
      public LocalDateTime getRecognitionTime() {
        return this.recognitionTime;
      }
    
      public void setRecognitionTime(LocalDateTime recognitionTime) {
        this.recognitionTime = recognitionTime;
      }
    
      public String getPassStatus() {
        return this.passStatus;
      }
    
      public void setPassStatus(String passStatus) {
        this.passStatus = passStatus;
      }
    
      public String getName() {
        return this.name;
      }
    
      public void setName(String name) {
        this.name = name;
      }
    
      public String getVehicleType() {
        return this.vehicleType;
      }
    
      public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
      }
    
      @Override
      public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", plateNumber='" + getPlateNumber() + "'" +
            ", recognitionTime='" + getRecognitionTime() + "'" +
            ", recognitionTimeStr='" + getRecognitionTimeStr() + "'" +
            ", passStatus='" + getPassStatus() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", cameraId='" + getCameraId() + "'" +
            ", name='" + getName() + "'" +
            ", vehicleType='" + getVehicleType() + "'" +
            "}";
      }
}