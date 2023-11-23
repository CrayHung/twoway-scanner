package com.twoway.Xinwu.entity;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface AllowListRepository extends CrudRepository<AllowList , Integer> {

     Iterable<AllowList> findAllByOrderByIdDesc();

       //使用Query語句
    @Query(value = "SELECT * FROM allow_list WHERE plate_number LIKE ?1 ", nativeQuery = true)
    List<AllowList> findByPlateNumber(String plateNumber);

    //白名單+預約名單
    @Query(value = "SELECT * FROM allow_list WHERE pass_Status LIKE '%pass%' ORDER BY id DESC", nativeQuery = true)
    Iterable<AllowList> findByPassStatusOrderByIdDesc();

    //白名單
    @Query(value = "SELECT * FROM allow_list WHERE pass_Status LIKE 'pass' ORDER BY id DESC", nativeQuery = true)
    Iterable<AllowList> findWhiteByPassStatusOrderByIdDesc();

    //預約名單
    @Query(value = "SELECT * FROM allow_list WHERE pass_Status LIKE 'temp_pass' ORDER BY id DESC", nativeQuery = true)
    Iterable<AllowList> findPassByPassStatusOrderByIdDesc();

    //還有效的預約名單
    @Query(value = "SELECT * FROM allow_list WHERE pass_Status LIKE 'temp_pass' AND STR_TO_DATE(visitor_end_str, '%Y-%m-%d %H:%i:%s.%f') > NOW() ORDER BY id DESC", nativeQuery = true)
    Optional<Iterable<AllowList>> findVisitorByPassStatusOrderByIdDesc();

    //修改預約名單
    @Modifying
    @Transactional
    @Query("UPDATE AllowList a SET a.visitorStartStr = :visitor_start_str, a.visitorEndStr = :visitor_end_str WHERE a.plateNumber = :plateNumber")
    void modifyTempPass(
      @Param("plateNumber")String plateNumber,
      @Param("visitor_start_str")String visitor_start_str,
      @Param("visitor_end_str")String visitor_end_str);
  }
