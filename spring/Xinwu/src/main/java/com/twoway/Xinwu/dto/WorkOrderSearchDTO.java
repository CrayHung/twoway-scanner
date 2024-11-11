package com.twoway.Xinwu.dto;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class WorkOrderSearchDTO {
    private List<String> workOrderNumber;
    private List<String> partNumber;
    private List<String> company;
    private List<String> quantity;
    private List<String> createUser;
    private List<String> editUser;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> createDateStart;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> createDateEnd;

    // Getters and Setters
    public List<String> getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(List<String> workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public List<String> getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(List<String> partNumber) {
        this.partNumber = partNumber;
    }

    public List<String> getCompany() {
        return company;
    }

    public void setCompany(List<String> company) {
        this.company = company;
    }

    public List<String> getQuantity() {
        return quantity;
    }

    public void setQuantity(List<String> quantity) {
        this.quantity = quantity;
    }

    public List<String> getCreateUser() {
        return createUser;
    }

    public void setCreateUser(List<String> createUser) {
        this.createUser = createUser;
    }

    public List<String> getEditUser() {
        return editUser;
    }

    public void setEditUser(List<String> editUser) {
        this.editUser = editUser;
    }

    public List<LocalDate> getCreateDateStart() {
        return createDateStart;
    }

    public void setCreateDateStart(List<LocalDate> createDateStart) {
        this.createDateStart = createDateStart;
    }

    public List<LocalDate> getCreateDateEnd() {
        return createDateEnd;
    }

    public void setCreateDateEnd(List<LocalDate> createDateEnd) {
        this.createDateEnd = createDateEnd;
    }
}
