package com.abdisalam.hoopup.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home(){
        return "Hoop API is running";
    }

    @GetMapping("/health")
    public String health(){
        return "OK";
    }


}
