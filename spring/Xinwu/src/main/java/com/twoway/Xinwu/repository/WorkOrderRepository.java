package com.twoway.Xinwu.repository;

import com.twoway.Xinwu.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
  WorkOrder findByWorkOrderNumber(String workOrderNumber);
}