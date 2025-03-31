package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "aci_customer_part_table")
public class ACICustomerPartTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aci_part_number", nullable = false)
    private String aciPartNumber;

    @Column(name = "customer_part_number")
    private String customerPartNumber;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "input_mode", nullable = false)
    private String inputMode;

    // Getters and Setters
    public String getCustomerPartNumber() {
        return customerPartNumber;
    }

    public void setCustomerPartNumber(String customerPartNumber) {
        this.customerPartNumber = customerPartNumber;
    }

    public String getAciPartNumber() {
        return aciPartNumber;
    }

    public void setAciPartNumber(String aciPartNumber) {
        this.aciPartNumber = aciPartNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getInputMode() {
        return inputMode;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }

}