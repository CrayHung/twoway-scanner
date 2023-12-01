package com.twoway.Xinwu.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Autowired
    private UserDetailsService userDetailsService;

    private static final String SECRET_KEY="f055902968528c61af559aca12f237dbbe88e4b7ebc9ce8ca5a6bf608abce834";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //如果傳入的只有user資料
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }

    //產生token 
    public String generateToken(
        Map<String , Object> extraClaims,
        UserDetails userDetails
    ){
        return Jwts
            .builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000*30))   //1000*60=1min
            .signWith(getSignInKey(),SignatureAlgorithm.HS256)
            .compact();
    }

    //token有效-> 1.token中的username和資料庫的username相同   2.JWT token未過期
    public boolean isTokenValid(String token , UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    /* */

    public String generateTokenUsingRefreshToken(String refreshToken) {
        var user = getUserFromRefreshToken(refreshToken);
        return generateToken(user);
    }

    private UserDetails getUserFromRefreshToken(String refreshToken) {
        var username = extractUsername(refreshToken);
        return userDetailsService.loadUserByUsername(username);

    }

}
