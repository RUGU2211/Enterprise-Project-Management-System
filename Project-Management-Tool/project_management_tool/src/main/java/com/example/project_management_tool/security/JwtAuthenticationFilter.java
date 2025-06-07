package com.example.project_management_tool.security;

import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;

import static com.example.project_management_tool.security.SecurityConstants.HEADER_STRING;
import static com.example.project_management_tool.security.SecurityConstants.TOKEN_PREFIX;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // Log request info for debugging
            logRequestDetails(httpServletRequest);

            String jwt = getJWTFromRequest(httpServletRequest);

            if(StringUtils.hasText(jwt)) {
                logger.info("JWT token found in request");
                
                if(tokenProvider.validateToken(jwt)) {
                    logger.info("JWT token is valid");
                    Long userId = tokenProvider.getUserIdFromJWT(jwt);
                    logger.info("User ID from JWT: " + userId);
                    
                    User userDetails = customUserDetailsService.loadUserById(userId);
                    logger.info("User loaded from database: " + userDetails.getUsername());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, Collections.emptyList());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    logger.info("Authentication set in SecurityContextHolder");
                } else {
                    logger.warn("JWT token is invalid");
                }
            } else {
                logger.debug("No JWT token found in request");
            }

        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        // Set CORS headers for preflight requests
        if (httpServletRequest.getMethod().equals("OPTIONS")) {
            logger.info("Handling OPTIONS preflight request for URI: " + httpServletRequest.getRequestURI());
            httpServletResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            httpServletResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
            httpServletResponse.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept");
            httpServletResponse.setHeader("Access-Control-Expose-Headers", "Authorization, Content-Type");
            httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpServletResponse.setHeader("Access-Control-Max-Age", "3600");
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            return; // Important: stop the filter chain for OPTIONS requests
        } else {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
    }

    private void logRequestDetails(HttpServletRequest request) {
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("Request Method: " + request.getMethod());
        
        logger.debug("Request Headers:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (headerName.equalsIgnoreCase("authorization")) {
                logger.debug(headerName + ": [PROTECTED]");
            } else {
                logger.debug(headerName + ": " + request.getHeader(headerName));
            }
        }
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HEADER_STRING);

        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith(TOKEN_PREFIX)) {
            logger.debug("Bearer token found, extracting JWT");
            return bearerToken.substring(7);
        }

        return null;
    }
}