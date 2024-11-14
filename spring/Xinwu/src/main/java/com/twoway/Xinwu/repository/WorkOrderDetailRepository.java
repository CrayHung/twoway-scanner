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
    List<WorkOrderDetail> findByParentWorkOrderNumbers(@Param("numbers") Set<String> workOrderNumbers);
}