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
    private String carType="";

    private String imagePath = "";
    private String cameraId = "";
    /* plateIn判斷進出場用 , 初始值都是true -> "想進去" */
    private Boolean plateIn=true;


    public Boolean getPlateIn(){
      return this.plateIn;
  
    }  
    public void setPlateIn(Boolean plateIn){
      this.plateIn = plateIn;
    }
    /* */

    public String getCarType() {
      return this.carType;
    }
  
    public void setCarType(String carType) {
      this.carType = carType;
    }

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
    
      
    
      @Override
      public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", plateNumber='" + getPlateNumber() + "'" +
            ", recognitionTime='" + getRecognitionTime() + "'" +
            ", recognitionTimeStr='" + getRecognitionTimeStr() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", cameraId='" + getCameraId() + "'" +
            ", plateIn='" + getPlateIn() + "'" +
            ", carType='" + getCarType() + "'" +
            "}";
      }
}