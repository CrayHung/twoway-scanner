package com.twoway.Xinwu.entity;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;


public interface StockRepository extends JpaRepository<Stock, Long>{
    // 根據 palletNames 刪除對應的 stock 資料
    @Transactional
    void deleteByPalletNameIn(List<String> palletNames);

    // 根據 ID 刪除對應的 stock 資料
    @Transactional
    void deleteByIdIn(List<Long> ids);
}
