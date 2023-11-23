package com.twoway.Xinwu.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminDemoController {
    
    @GetMapping
    public String sayHello(){
        return "hello from admin";
    }
}
