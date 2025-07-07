package com.tecsup.backendusuarios.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

        // Obtener datos del usuario
        String firstName = "";
        String lastName = "";
        String email = userPrincipal.getUsername();

        // Si hay atributos (OAuth2), intenta obtenerlos de ahí
        if (userPrincipal.getAttributes() != null) {
            Object fn = userPrincipal.getAttributes().get("firstName");
            Object ln = userPrincipal.getAttributes().get("lastName");
            Object em = userPrincipal.getAttributes().get("email");
            if (fn instanceof String) firstName = (String) fn;
            if (ln instanceof String) lastName = (String) ln;
            if (em instanceof String) email = (String) em;
        }

        // Si siguen vacíos, intenta obtenerlos del principal (para login normal)
        if (firstName.isEmpty() && userPrincipal instanceof UserDetails) {
            try {
                java.lang.reflect.Method getFirstName = userPrincipal.getClass().getMethod("getFirstName");
                java.lang.reflect.Method getLastName = userPrincipal.getClass().getMethod("getLastName");
                Object fn = getFirstName.invoke(userPrincipal);
                Object ln = getLastName.invoke(userPrincipal);
                if (fn instanceof String) firstName = (String) fn;
                if (ln instanceof String) lastName = (String) ln;
            } catch (Exception ignored) {}
        }

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("email", email)
                .claim("firstName", firstName)
                .claim("lastName", lastName)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}