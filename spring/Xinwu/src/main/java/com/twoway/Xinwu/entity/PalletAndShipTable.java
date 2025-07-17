package com.twoway.Xinwu.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "pallet_and_ship_table")
public class PalletAndShipTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ship_id", unique = true)
    private String shipId;

    // 用逗號分隔或 JSON
    @Column(name = "pallet_names", columnDefinition = "TEXT")
    private String palletNames; 

    @Column(name = "storage_time")
    private LocalDateTime storageTime;


    public LocalDateTime getStorageTime() {
        return storageTime;
    }

    public void setStorageTime(LocalDateTime storageTime) {
        this.storageTime = storageTime;
    }

    
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.
        id = id;
    }

    public String getShipId() {
        return shipId;
    }

    public void setShipId(String shipId) {
        this.shipId = shipId;
    }

    public String getPalletNames() {
        return this.palletNames;
    }

    public void setPalletNames(String palletNames) {
        this.palletNames = palletNames;
    }

}
