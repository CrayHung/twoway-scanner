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
    
   

    @Query("SELECT w FROM WorkOrderDetail w WHERE " +
           "(:workOrderNumber IS NULL OR w.workOrder.workOrderNumber = :workOrderNumber) AND " +
           "(:snStart IS NULL OR w.SN >= :snStart) AND " +
           "(:snEnd IS NULL OR w.SN <= :snEnd) AND " +
           "(:qrRFTray IS NULL OR w.QR_RFTray = :qrRFTray) AND " +
           "(:qrPS IS NULL OR w.QR_PS = :qrPS) AND " +
           "(:qrHS IS NULL OR w.QR_HS = :qrHS) AND " +
           "(:qrBackup1 IS NULL OR w.QR_backup1 = :qrBackup1) AND " +
           "(:qrBackup2 IS NULL OR w.QR_backup2 = :qrBackup2) AND " +
           "(:qrBackup3 IS NULL OR w.QR_backup3 = :qrBackup3) AND " +
           "(:qrBackup4 IS NULL OR w.QR_backup4 = :qrBackup4) AND " +
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
    
    @Query("SELECT w FROM WorkOrderDetail w JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrder();

    @Query("SELECT w FROM WorkOrderDetail w LEFT JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrderLeftJoin();
    
}