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

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{


        // http
        //         .csrf(csrf -> csrf
        //             .disable())

        //             .authorizeHttpRequests(authorize -> authorize
        //                 .requestMatchers("/auth/**").permitAll()
        //                 .requestMatchers("/demo/admin/.*").hasRole("ADMIN")
        //                 .requestMatchers("/users/.*").hasRole("ADMIN")
        //                 // .requestMatchers("/demo/user").permitAll()
        //                 // .requestMatchers("/demo/admin").hasRole("ADMIN")

        //                 //.requestMatchers(new RegexRequestMatcher("/demo/admin", "GET")).hasRole("ADMIN")
        //                 //.requestMatchers("/demo/admin").hasRole("ADMIN")
        //                 .anyRequest().authenticated() 
        //             )
        //             .sessionManagement()
        //             //避免儲存authentication state , 如此每個請求都要進行驗證
        //             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        //             .and()
        //             .authenticationProvider(authenticationProvider)
        //             .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        /*要控制API路徑 , 在@RequestMapping作控管 */
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/demo/admin/**").hasRole("ADMIN")
                            .anyRequest()
                            .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        

        return http.build();
    }
}
