package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "input_modes")
public class InputMode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "part_number", nullable = false)
    private String partNumber;

    @Column(name = "input_mode", nullable = false)
    private String inputMode;

    @Column(name = "number_per_pallet", nullable = false)
    private int numberPerPallet;

    @Column(name = "summary")
    private String summary;

    @Column(name = "note")
    private String note;

    @Column(name = "create_user")
    private String createUser;

    @Column(name = "create_date", updatable = false)
    @CreationTimestamp
    private LocalDate createDate;

    @Column(name = "edit_user")
    private String editUser;

    @Column(name = "edit_date")
    @UpdateTimestamp
    private LocalDate editDate;

    /**根據ACI新增兩欄位 */
    @Column(name = "aci_part_number", nullable = false)
    private String aciPartNumber;

    @Column(name = "custom_part_number")
    private String customPartNumber;


    // Getters and Setters
    public String getCustomPartNumber() {
        return customPartNumber;
    }

    public void setCustomPartNumber(String customPartNumber) {
        this.customPartNumber = customPartNumber;
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

    public String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getInputMode() {
        return inputMode;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }

    public int getNumberPerPallet() {
        return numberPerPallet;
    }

    public void setNumberPerPallet(int numberPerPallet) {
        this.numberPerPallet = numberPerPallet;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public String getEditUser() {
        return editUser;
    }

    public void setEditUser(String editUser) {
        this.editUser = editUser;
    }

    public LocalDate getEditDate() {
        return editDate;
    }

    public void setEditDate(LocalDate editDate) {
        this.editDate = editDate;
    }
}