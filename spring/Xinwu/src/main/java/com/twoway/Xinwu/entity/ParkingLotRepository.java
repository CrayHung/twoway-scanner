package com.twoway.Xinwu.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ParkingLotRepository extends CrudRepository<ParkingLot , Integer> {



    @Query(value = "SELECT amount FROM parking_lot WHERE car_Type LIKE ?1", nativeQuery = true)
    Integer findAllByCarTypeByAmount(String carType);

    @Query(value = "SELECT * FROM parking_lot WHERE car_Type LIKE ?1", nativeQuery = true)
    ParkingLot findByCarType(String carType);

    @Query(value = "SELECT * FROM parking_lot", nativeQuery = true)
    Iterable<ParkingLot> findAll();


    @Query(value = "SELECT DISTINCT car_Type FROM parking_lot", nativeQuery = true)
    Iterable findAllCarType();
    

}
