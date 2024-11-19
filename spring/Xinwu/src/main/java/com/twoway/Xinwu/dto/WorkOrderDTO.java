package com.twoway.Xinwu.dto;

import java.time.LocalDate;

import com.twoway.Xinwu.entity.WorkOrder;

public class WorkOrderDTO {
    private Long id;
    private String workOrderNumber;
    private int quantity;
    private String partNumber;
    private String company;
    private String createUser;
    private LocalDate createDate;
    private String editUser;
    private LocalDate editDate;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
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

    // Static factory method
    public static WorkOrderDTO fromEntity(WorkOrder workOrder) {
        WorkOrderDTO dto = new WorkOrderDTO();
        dto.setId(workOrder.getId());
        dto.setWorkOrderNumber(workOrder.getWorkOrderNumber());
        dto.setQuantity(workOrder.getQuantity());
        dto.setPartNumber(workOrder.getPartNumber());
        dto.setCompany(workOrder.getCompany());
        dto.setCreateUser(workOrder.getCreateUser());
        dto.setCreateDate(workOrder.getCreateDate());
        dto.setEditUser(workOrder.getEditUser());
        dto.setEditDate(workOrder.getEditDate());
        return dto;
    }
}
