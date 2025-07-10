package com.twoway.Xinwu.entity;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface PalletAndShipTableRepository extends JpaRepository<PalletAndShipTable, Long> {
    Optional<PalletAndShipTable> findByShipId(String shipId);
}
