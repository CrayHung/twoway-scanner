package com.twoway.Xinwu.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippedRepository extends JpaRepository<Shipped, Integer> {
}

