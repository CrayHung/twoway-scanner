package com.twoway.Xinwu.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {

    @CrossOrigin(origins = "*" )
    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }
}