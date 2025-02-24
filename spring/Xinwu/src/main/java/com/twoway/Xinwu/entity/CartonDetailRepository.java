package com.twoway.Xinwu.entity;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface CartonDetailRepository extends JpaRepository<CartonDetail, Integer> {

    List<CartonDetail> findByPalletName(String cartonName);
    
    List<CartonDetail> findByPalletNameAndCartonNameIn(String palletName, List<String> cartonNames);

    void deleteByPalletNameAndIdIn(String palletName, List<Integer> ids);

    @Modifying
    @Transactional
    @Query("UPDATE CartonDetail c SET c.palletName = :palletName WHERE c.id IN :ids")
    void updatePalletName(@Param("ids") List<Integer> ids, @Param("palletName") String palletName);
}

