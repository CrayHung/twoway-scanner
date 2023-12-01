package com.twoway.Xinwu.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demo")
public class DemoController {

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("hello 1");
    }


    @GetMapping("/user")
    public ResponseEntity<String> sayHello2(){
        return ResponseEntity.ok("from user ");
    }

}
