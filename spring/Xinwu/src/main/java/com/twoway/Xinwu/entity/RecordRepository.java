package com.twoway.Xinwu.entity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;

// 創建執行CRUD接口 , 第一個參數是實體(entity)類型 , 第二個參數是該entity的主key的類型
public interface RecordRepository extends CrudRepository<Record , Integer> , JpaSpecificationExecutor<Record>{

    /*cam */
    @Query(value = "SELECT * FROM record WHERE camera_id=?1 ORDER by id DESC LIMIT 1", nativeQuery = true)
    Optional<Record> findAllLatestRecordByCameraId(String cameraId);



    //所有紀錄
    Iterable<Record> findAllByOrderByIdDesc();
    //最新一筆
    Optional<Record> findFirstByPlateNumberOrderByIdDesc(String plateNumber);

    //進出場搜尋
    @Query(value = "SELECT * FROM record WHERE (:plateIn IS NULL OR plate_In = :plateIn)  ORDER by id DESC", nativeQuery = true)
    Iterable<Record> searchByPlateIn( @Param("plateIn")Boolean plateIn);

    //正確車號
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE ?1 ORDER by id DESC", nativeQuery = true)
    Iterable<Record> findByPlateNumber(String plateNumber);
    
    //模糊車號
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE %:plateNumber% ORDER by id DESC ", nativeQuery = true)
    Iterable<Record> searchByPlateNumberNotSure(
        @Param("plateNumber")String plateNumber);

    //日期區間
    @Query(value = "SELECT * FROM record WHERE DATE(recognition_time) BETWEEN ?1 AND ?2 ORDER by id DESC", nativeQuery = true)
    Iterable<Record> searchByDateBetween(String startDate,String endDate);
    

    //模糊車號+日期區間
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE %?1% AND DATE(recognition_time) BETWEEN ?2 AND ?3 ORDER by id DESC", nativeQuery = true)
    Iterable<Record> searchByDateBetweenAndPlateNumber(String plateNumber, String startDate,String endDate);


    //模糊車號+日期區間+進出
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE %:plateNumber% AND DATE(recognition_time) BETWEEN :startDate AND :endDate AND (:plateIn IS NULL OR plate_In = :plateIn) ORDER by id DESC ", nativeQuery = true)
    Iterable<Record> searchByDateByPlateNumberByPlateIn(
        @Param("plateNumber")String plateNumber,
        @Param("startDate")String startDate,
        @Param("endDate")String endDate,
        @Param("plateIn")Boolean plateIn);
    
    //模糊車號+尚在場內
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE %:plateNumber% AND plate_In = false ORDER by id DESC ", nativeQuery = true)
    Iterable<Record> searchByPlateNumberNotSureAndPlateInFalse(
        @Param("plateNumber")String plateNumber
    );


    //正確車號+攝影機ID
    @Query(value = "SELECT * FROM record WHERE camera_id LIKE ?1 AND plate_number LIKE ?2 ORDER by id DESC LIMIT 1", nativeQuery = true)
    Optional<Record> findByCameraIdByPlateNumber(String cameraId,String plateNumber);


}