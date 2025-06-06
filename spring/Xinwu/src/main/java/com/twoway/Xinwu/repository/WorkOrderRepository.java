package com.twoway.Xinwu.repository;

import com.twoway.Xinwu.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Collection;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long>, JpaSpecificationExecutor<WorkOrder>{
  WorkOrder findByWorkOrderNumber(String workOrderNumber);

  //  優化批次查詢工單用 
  List<WorkOrder> findAllByWorkOrderNumberIn(Collection<String> workOrderNumbers);


  @Query("SELECT w FROM WorkOrder w WHERE " +
         "(:workOrderNumber IS NULL OR w.workOrderNumber = :workOrderNumber) AND " +
         "(:quantity IS NULL OR w.quantity = :quantity) AND " +
         "(:partNumber IS NULL OR w.partNumber = :partNumber) AND " +
         "(:company IS NULL OR w.company = :company) AND " +
         "(:createUser IS NULL OR w.createUser = :createUser) AND " +
         "(:productionDateStart IS NULL OR w.createDate >= :productionDateStart) AND " +
         "(:productionDateEnd IS NULL OR w.createDate < :productionDateEnd)")
  List<WorkOrder> searchWorkOrders(
      @Param("workOrderNumber") String workOrderNumber,
      @Param("quantity") Integer quantity,
      @Param("partNumber") String partNumber,
      @Param("company") String company,
      @Param("createUser") String createUser,
      @Param("productionDateStart") LocalDate productionDateStart,
      @Param("productionDateEnd") LocalDate productionDateEnd
  );
}