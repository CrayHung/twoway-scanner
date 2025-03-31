package com.twoway.Xinwu.entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface PalletRepository extends JpaRepository<Pallet, Long> {
    
    //單一個palletName查詢
    Optional<Pallet> findByPalletName(String palletName);
    // List<Pallet> findByPalletName(String palletName);

    // 多個palletName查詢
    List<Pallet> findByPalletNameIn(List<String> palletNames);

    //將多個pallet的quantity改為0
    @Modifying
    @Transactional
    @Query("UPDATE Pallet p SET p.quantity = 0 WHERE p.palletName IN :palletNames")
    int updateQuantityToZero(@Param("palletNames") List<String> palletNames);

    //一次刪除多個pallet
    @Transactional
    void deleteByPalletNameIn(List<String> palletNames);

}
