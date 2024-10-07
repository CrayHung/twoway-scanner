package com.twoway.Xinwu.repository;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkOrderDetailRepository extends JpaRepository<WorkOrderDetail, Long>, JpaSpecificationExecutor<WorkOrderDetail> {
    
   // 範圍搜尋

    @Query("SELECT w FROM WorkOrderDetail w WHERE " +
           "(:workOrderNumber IS NULL OR w.workOrder.workOrderNumber = :workOrderNumber) AND " +
           "(:snStart IS NULL OR w.sn >= :snStart) AND " +
           "(:snEnd IS NULL OR w.sn <= :snEnd) AND " +
           "(:qrRFTray IS NULL OR w.qrRfTray = :qrRFTray) AND " +
           "(:qrPS IS NULL OR w.qrPs = :qrPS) AND " +
           "(:qrHS IS NULL OR w.qrHs = :qrHS) AND " +
           "(:qrBackup1 IS NULL OR w.qrBackup1 = :qrBackup1) AND " +
           "(:qrBackup2 IS NULL OR w.qrBackup2 = :qrBackup2) AND " +
           "(:qrBackup3 IS NULL OR w.qrBackup3 = :qrBackup3) AND " +
           "(:qrBackup4 IS NULL OR w.qrBackup4 = :qrBackup4) AND " +
           "(:productionDateStart IS NULL OR w.create_date >= :productionDateStart) AND " +
           "(:productionDateEnd IS NULL OR w.create_date <= :productionDateEnd)")
    List<WorkOrderDetail> searchWorkOrderDetails(
        @Param("workOrderNumber") String workOrderNumber,
        @Param("snStart") String snStart,
        @Param("snEnd") String snEnd,
        @Param("qrRFTray") String qrRFTray,
        @Param("qrPS") String qrPS,
        @Param("qrHS") String qrHS,
        @Param("qrBackup1") String qrBackup1,
        @Param("qrBackup2") String qrBackup2,
        @Param("qrBackup3") String qrBackup3,
        @Param("qrBackup4") String qrBackup4,
        @Param("productionDateStart") LocalDate productionDateStart,
        @Param("productionDateEnd") LocalDate productionDateEnd
    );
    

    // Get All function
    @Query("SELECT w FROM WorkOrderDetail w JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrder();

    @Query("SELECT w FROM WorkOrderDetail w LEFT JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrderLeftJoin();
}