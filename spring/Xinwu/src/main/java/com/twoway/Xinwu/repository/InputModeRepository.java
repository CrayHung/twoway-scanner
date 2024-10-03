package com.twoway.Xinwu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.twoway.Xinwu.entity.InputMode;

public interface InputModeRepository extends JpaRepository<InputMode, Long> {
    // 基本的CRUD操作已由JpaRepository提供
    // 如果將來需要自定義查詢方法，可以在這裡添加
}
