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

    //用ids 將多個palletName更改
    @Modifying
    @Transactional
    @Query("UPDATE CartonDetail c SET c.palletName = :palletName WHERE c.id IN :ids")
    void updatePalletName(@Param("ids") List<Integer> ids, @Param("palletName") String palletName);

    //將多個pallet裡面的cartonDetail都刪掉
    @Modifying
    @Query("DELETE FROM CartonDetail cd WHERE cd.palletName IN :palletNames")
    int deleteByPalletNames(@Param("palletNames") List<String> palletNames);

    // 根據 palletName 查詢 cartonDetail
    @Query("SELECT c FROM CartonDetail c WHERE c.palletName IN :palletNames")
    List<CartonDetail> findByPalletNames(@Param("palletNames") List<String> palletNames);
}
