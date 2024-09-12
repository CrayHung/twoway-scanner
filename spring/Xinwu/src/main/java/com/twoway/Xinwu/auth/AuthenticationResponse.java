package com.twoway.Xinwu.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Data可自動生成getter、setter、toString、equals、hashCode 等方法
//@Builder生成建構者模型
//@AllArgsConstructor自動生成帶有屬性參數的建構者方法
//@NoArgsConstructor自動生成一個無參數的建構者方法

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;
    private String refreshToken;
    private String error;
}
