package com.twoway.Xinwu.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, 
        @NonNull HttpServletResponse response, 
        @NonNull FilterChain filterChain)
            throws ServletException, IOException {
       
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final String username;

            //如果authHeader不符合JWT , 重新篩選
            if(authHeader==null||!authHeader.startsWith("Bearer ")){
                filterChain.doFilter(request, response);
                return;
            }

            //"Bearer " 從後面第7個開始是文件內容
            jwt = authHeader.substring(7);
            //將jwt中的username提取出來
            username= jwtService.extractUsername(jwt);

            //如果JWT中有username 但 還沒驗證(getContext內沒有東西)
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                //依照jwt提取出的username , 從資料庫中取得該筆user 資料
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                //驗證JWT是否有效 且與 userDetails資料相符
                if(jwtService.isTokenValid(jwt, userDetails)){ 
                    //產生認證 , 傳入的參數 1.user(主體..用戶資料) 2.密碼(憑證...JWT不需要密碼) 3.用戶權限 , 彙整成認證後的(authToken)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities() 
                    );
                    //將Web請求的資訊(如請求地址和會話ID)添加到authToken中
                    authToken.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(request));

                    //告知Spring security此user已通過認證  將token更新儲存於SecurityContextHolder以供後續的所有操作使用(訪問API,驗證身分..等)
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                }
            }
            filterChain.doFilter(request, response);
    }
}