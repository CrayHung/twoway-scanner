package com.twoway.Xinwu.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private String palletName;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity=quantity;
    }

    public String getPalletName() {
        return this.palletName;
    }

    public void setPalletName(String palletName) {
        this.palletName=palletName;
    }
  

}
