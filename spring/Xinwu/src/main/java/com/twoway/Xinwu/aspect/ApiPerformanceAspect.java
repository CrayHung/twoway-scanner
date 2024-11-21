package com.twoway.Xinwu.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class ApiPerformanceAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ApiPerformanceAspect.class);

    @Around("@within(org.springframework.web.bind.annotation.RestController) || " +
            "@within(org.springframework.stereotype.Controller)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        
        // 獲取請求信息
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
            .currentRequestAttributes())
            .getRequest();
            
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();

        try {
            // 開始計時 - 整體執行時間
            stopWatch.start("Total Execution");
            
            // 執行實際的方法
            Object result = joinPoint.proceed();
            
            return result;
            
        } finally {
            stopWatch.stop();
            
            // 計算執行時間
            long totalTimeMillis = stopWatch.getTotalTimeMillis();
            
            // 輸出性能日誌
            logger.info("\n-------- API Performance Report --------" +
                    "\nAPI Path: {} {}" +
                    "\nController: {}" +
                    "\nMethod: {}" +
                    "\nTotal Execution Time: {}ms" +
                    "\n--------------------------------------",
                    httpMethod, requestURI,
                    className,
                    methodName,
                    totalTimeMillis);

            // 如果執行時間超過某個閾值，輸出警告
            if (totalTimeMillis > 1000) { // 1秒
                logger.warn("⚠️ Performance Warning: API execution took more than 1 second!");
            }
        }
    }
}