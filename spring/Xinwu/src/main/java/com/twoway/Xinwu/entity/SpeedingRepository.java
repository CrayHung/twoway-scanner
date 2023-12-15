package com.twoway.Xinwu.entity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpeedingRepository extends JpaRepository<Speeding , Integer>{

    @Query(value = "SELECT * FROM speeding WHERE plate_number LIKE ?1 ORDER by id DESC", nativeQuery = true)
    Iterable<Speeding> findByPlateNumber(String plateNumber);


    @Query(value = "SELECT * FROM speeding WHERE avg_Speed > ?1 ORDER by id DESC", nativeQuery = true)
    Iterable<Speeding> findBySpeed(String speed);
    

    //正確車號+攝影機ID
    @Query(value = "SELECT * FROM speeding WHERE camera_id LIKE ?1 AND plate_number LIKE ?2 ORDER by id DESC LIMIT 1", nativeQuery = true)
    Optional<Speeding> findByCameraIdByPlateNumber(String cameraId,String plateNumber);
    
}
