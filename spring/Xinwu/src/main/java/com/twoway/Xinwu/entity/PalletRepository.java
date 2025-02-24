package com.twoway.Xinwu.entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PalletRepository extends JpaRepository<Pallet, Long> {
    
    //單一個palletName查詢
    Optional<Pallet> findByPalletName(String palletName);
    // List<Pallet> findByPalletName(String palletName);

    // 多個palletName查詢
    List<Pallet> findByPalletNameIn(List<String> palletNames);

}
