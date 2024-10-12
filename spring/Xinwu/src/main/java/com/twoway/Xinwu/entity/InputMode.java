package com.twoway.Xinwu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "input_modes")
public class InputMode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String partNumber;

    @Column(nullable = false)
    private String inputMode;

    // Getters
    public Long getId() {
        return id;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public String getInputMode() {
        return inputMode;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }
}