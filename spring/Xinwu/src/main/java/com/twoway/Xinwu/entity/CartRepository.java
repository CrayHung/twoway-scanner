package com.twoway.Xinwu.entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findAll();
    void deleteById(Integer id);

    @Query("SELECT c FROM Cart c WHERE c.palletName IN :palletNames")
    List<Cart> findByPalletNames(@Param("palletNames") List<String> palletNames);

    List<Cart> findBySn(String sn);
}