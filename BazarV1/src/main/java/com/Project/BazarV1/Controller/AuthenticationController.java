package com.Project.BazarV1.Controller;

import com.Project.BazarV1.DTO.AuthenticationRequest;
import com.Project.BazarV1.DTO.AuthenticationResponseDTO;
import com.Project.BazarV1.Service.UserDetailsServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("permitAll()")
public class AuthenticationController {

    @Autowired
    private UserDetailsServiceImp userDetailService;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody AuthenticationRequest authenticationRequest) {
        return new ResponseEntity<>(this.userDetailService.login(authenticationRequest), HttpStatus.OK);
    }
}
