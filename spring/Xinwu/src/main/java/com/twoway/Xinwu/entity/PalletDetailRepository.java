package com.twoway.Xinwu.entity;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PalletDetailRepository extends JpaRepository<PalletDetail, Long> {

    List<PalletDetail> findByPalletName(String palletName);
}

