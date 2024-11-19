package com.twoway.Xinwu.repository;

// import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.entity.WorkOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Set;

@Repository
public interface WorkOrderDetailRepository extends JpaRepository<WorkOrderDetail, Long>, JpaSpecificationExecutor<WorkOrderDetail> {
    
    // Get All function
    @Query("SELECT w FROM WorkOrderDetail w JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrder();

    @Query("SELECT w FROM WorkOrderDetail w LEFT JOIN FETCH w.workOrder")
    List<WorkOrderDetail> findAllWithWorkOrderLeftJoin();

    // post時自動分配 detailid
    @Query("SELECT MAX(w.detailId) FROM WorkOrderDetail w WHERE w.workOrder.workOrderNumber = :workOrderNumber")
    Integer findMaxDetailIdByWorkOrderNumber(@Param("workOrderNumber") String workOrderNumber);

    //刪除時計算實際 detail_id 數量
    @Query("SELECT COUNT(w) FROM WorkOrderDetail w WHERE w.workOrder.workOrderNumber = :workOrderNumber")
    Long countByWorkOrderNumber(@Param("workOrderNumber") String workOrderNumber);

    @Query("SELECT w FROM WorkOrderDetail w WHERE w.workOrder.workOrderNumber = :workOrderNumber ORDER BY w.detailId")
    List<WorkOrderDetail> findByWorkOrderNumberOrderByDetailId(@Param("workOrderNumber") String workOrderNumber);

    // 自動計算 detailid 有沒有超過 quantity
    @Query("SELECT w.workOrder.workOrderNumber, COUNT(w) FROM WorkOrderDetail w WHERE w.workOrder.workOrderNumber IN :workOrderNumbers GROUP BY w.workOrder.workOrderNumber")
    List<Object[]> countDetailsByWorkOrderNumbers(@Param("workOrderNumbers") List<String> workOrderNumbers);
    
    // post 前先檢查是否workOrder已有該 workOrderNumber
    @Query("SELECT wd FROM WorkOrderDetail wd WHERE wd.workOrder.workOrderNumber IN :numbers")
    List<WorkOrderDetail> findByWorkOrderNumbers(@Param("numbers") Set<String> workOrderNumbers);

    // 檢查SN是否存在
    @Query("SELECT COUNT(w) > 0 FROM WorkOrderDetail w WHERE w.sn = :sn")
    boolean existsBySn(@Param("sn") String sn);
    
    // 檢查任一BEDID是否存在
    @Query("SELECT COUNT(w) > 0 FROM WorkOrderDetail w WHERE " +
       "(:rfTrayBedid IS NOT NULL AND w.qrRfTrayBedid = :rfTrayBedid) OR " +
       "(:psBedid IS NOT NULL AND w.qrPsBedid = :psBedid) OR " +
       "(:hsBedid IS NOT NULL AND w.qrHsBedid = :hsBedid)")
    boolean existsByAnyBedid(
        @Param("rfTrayBedid") String rfTrayBedid,
        @Param("psBedid") String psBedid,
        @Param("hsBedid") String hsBedid
    );
}