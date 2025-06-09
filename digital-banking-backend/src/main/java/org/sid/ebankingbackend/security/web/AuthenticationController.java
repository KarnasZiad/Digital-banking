package org.sid.ebankingbackend.security.web;

import lombok.RequiredArgsConstructor;
import org.sid.ebankingbackend.security.dto.AuthenticationRequest;
import org.sid.ebankingbackend.security.dto.AuthenticationResponse;
import org.sid.ebankingbackend.security.dto.RegisterRequest;
import org.sid.ebankingbackend.security.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
