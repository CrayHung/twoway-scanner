package com.twoway.Xinwu.entity;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

// 創建執行CRUD接口 , 第一個參數是實體(entity)類型 , 第二個參數是該entity的主key的類型
public interface RecordRepository extends CrudRepository<Record , Integer>{
    
    //遵循Spring Data JPA 規則 , 可不用寫Query語句
    Iterable<Record> findAllByOrderByIdDesc();

    //Optional處理資料為null的狀況
    Optional<Record> findFirstByPlateNumberOrderByRecognitionTimeDesc(String platenumber);

    //使用Query語句
    @Query(value = "SELECT * FROM record WHERE plate_number LIKE ?1 ", nativeQuery = true)
    Record findByPlateNumber(String plateNumber);

}