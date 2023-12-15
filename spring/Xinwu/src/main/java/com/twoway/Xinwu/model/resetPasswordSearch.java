package com.twoway.Xinwu.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class resetPasswordSearch {
    
    private String token = "";
    private String password = "";


    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    @Override
    public String toString() {
        return "{" +
                "token='" + getToken() + '\'' +
                ", password='" + getPassword() + '\'' +
                "}";
    }

}
