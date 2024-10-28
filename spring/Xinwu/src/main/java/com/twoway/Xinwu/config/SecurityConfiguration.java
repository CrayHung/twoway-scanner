package com.twoway.Xinwu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    // private static final String[] WHITE_LIST_URL = 
    //         {
    //             "/auth/**",
    //             "/password/**",
    //             "/lpr/**",
    //             "/reset/**",
    //             "/forget/**"
    //         };

    private static final String[] WHITE_LIST_URL = 
    {
        "/auth/**",
        "/password/**",
        "/reset/**",
        "/forget/**",
        "/lpr/**", 
        //以下開發中API 測試完後需加入安全限制
        "/api/**",
        "/v2/api-docs",
        "/v3/api-docs", // OpenAPI 路徑
        "/configuration/ui",
        "/swagger-resources/**",
        "/configuration/security",
        "/swagger-ui.html",
        "/swagger-ui/**", // Swagger UI 靜態資源
        "/webjars/**",
        "/v2/api-docs/**",
        "/v3/api-docs/**",
        "/swagger.json",
        "/swagger-resources/**"
    };




    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{


        // http
        //     .csrf(AbstractHttpConfigurer::disable)
        //     .authorizeRequests(authorize ->
        //         authorize
        //             .antMatchers("/auth/register").hasRole("ADMIN")
        //             .antMatchers("/auth/**").permitAll()
        //             .antMatchers("/password/**").permitAll()
        //             .antMatchers("/parking/addparkinglots").hasRole("ADMIN")
        //             .antMatchers("/parking/modifyparkinglots").hasRole("ADMIN")
        //             .antMatchers("/admin/").hasRole("ADMIN")
        //             .anyRequest().authenticated()
        //     )
        //     .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
        //     .authenticationProvider(authenticationProvider)
        //     .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);




        /*要控制API路徑 , 在@RequestMapping作控管 */
        // http
        //         .csrf(AbstractHttpConfigurer::disable)
        //         .authorizeHttpRequests(req ->
        //                 req.requestMatchers("/auth/register").hasRole("ADMIN")
        //                     .requestMatchers("/auth/**").permitAll()
        //                     .requestMatchers("/password/**").permitAll()
        //                     .requestMatchers("/parking/addparkinglots").hasRole("ADMIN")
        //                     .requestMatchers("/parking/modifyparkinglots").hasRole("ADMIN")
        //                     .requestMatchers("/admin").hasRole("ADMIN")
        //                     .anyRequest()
        //                     .authenticated()
        //         )
        //         .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
        //         .authenticationProvider(authenticationProvider)
        //         .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        

        http
        .cors() // 啟用全域 CORS 設定
        .and()
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL).permitAll()
                            .requestMatchers("/ws").permitAll()
                                .requestMatchers("/parking/addparkinglots/**").hasAuthority("ADMIN")
                                .requestMatchers("/parking/modifyparkinglots/**").hasAuthority( "ADMIN")
                                .requestMatchers("/admin/**").hasAuthority("ADMIN")
                                .requestMatchers("/upload/**").hasAuthority("ADMIN")
                                .requestMatchers("/user/**").permitAll() //測試用日後需刪除
                                .requestMatchers("/api/**").permitAll() //測試用日後需刪除
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }
}
