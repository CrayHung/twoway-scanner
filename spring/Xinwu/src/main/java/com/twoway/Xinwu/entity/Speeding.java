package com.twoway.Xinwu.entity;

import java.time.Instant;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Speeding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String plateNumber;
    private LocalDateTime recognitionTime;
    private String recognitionTimeStr;
    private String carType;

    private String imagePath;
    private String cameraId;

    private long avgSpeed;


    public String getCameraId() {
        return cameraId;
    }
    
}
