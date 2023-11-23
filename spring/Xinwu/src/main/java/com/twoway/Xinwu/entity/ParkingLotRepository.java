package com.twoway.Xinwu.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface ParkingLotRepository extends CrudRepository<ParkingLot , Integer> {



    @Query(value = "SELECT amount FROM parking_lot WHERE car_Type LIKE ?1", nativeQuery = true)
    Integer findAllByCarTypeByAmount(String carType);

    @Query(value = "SELECT * FROM parking_lot WHERE car_Type LIKE ?1", nativeQuery = true)
    ParkingLot findByCarType(String carType);

    @Query(value = "SELECT * FROM parking_lot", nativeQuery = true)
    Iterable<ParkingLot> findAll();


    @Query(value = "SELECT DISTINCT car_Type FROM parking_lot", nativeQuery = true)
    Iterable findAllCarType();


    //修改某車種的總停車位數
    @Modifying
    @Transactional
    @Query("UPDATE ParkingLot p SET p.amount = :amount WHERE p.carType = :carType")
    void modifyParkingLots(
      @Param("carType")String carType,
      @Param("amount")Integer amount);



}
