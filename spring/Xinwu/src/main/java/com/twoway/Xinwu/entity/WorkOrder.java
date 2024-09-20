package com.twoway.Xinwu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
public class WorkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "work_order_number")
    private String workOrderNumber;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "part_number")
    private String partNumber;

    @Column(name = "create_user")
    private String createUser;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "edit_user")
    private String editUser;

    @Column(name = "edit_date")
    private LocalDateTime editDate;

    // Getters
    public Long getId() {
        return id;
    }

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public String getCreateUser() {
        return createUser;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public String getEditUser() {
        return editUser;
    }

    public LocalDateTime getEditDate() {
        return editDate;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public void setEditUser(String editUser) {
        this.editUser = editUser;
    }

    public void setEditDate(LocalDateTime editDate) {
        this.editDate = editDate;
    }
}