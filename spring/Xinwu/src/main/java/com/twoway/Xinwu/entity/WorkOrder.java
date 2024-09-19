package com.twoway.Xinwu.entity;

import jakarta.persistence.*;;

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

}
