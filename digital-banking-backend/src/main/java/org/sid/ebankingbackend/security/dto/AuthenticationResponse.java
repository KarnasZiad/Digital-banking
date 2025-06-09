package org.sid.ebankingbackend.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor @NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String[] roles;
}
