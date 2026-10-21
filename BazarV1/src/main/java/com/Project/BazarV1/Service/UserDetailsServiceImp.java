package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.AuthenticationRequest;
import com.Project.BazarV1.DTO.AuthenticationResponseDTO;
import com.Project.BazarV1.Model.UserSec;
import com.Project.BazarV1.Repository.IUserRepository;
import com.Project.BazarV1.Utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSec userSec = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found"));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Roles -> prefijo "ROLE_" para que funcione hasRole("X")
        userSec.getRolesList().forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRole())));

        // Permisos -> authorities planas (hasAuthority("X"))
        userSec.getRolesList().stream()
                .flatMap(role -> role.getPermissionsList().stream())
                .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermissionName())));

        return new User(
                userSec.getUsername(),
                userSec.getPassword(),
                userSec.isEnabled(),
                userSec.isAccountNotExpired(),
                userSec.isCredentialNotExpired(),
                userSec.isAccountNotLocked(),
                authorities);
    }

    public AuthenticationResponseDTO login(AuthenticationRequest authenticationRequest) {
        String username = authenticationRequest.username();
        String password = authenticationRequest.password();

        Authentication authentication = this.authentication(username, password);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.tokenCreation(authentication);
        return new AuthenticationResponseDTO(username, "Login Successful", token);
    }

    private Authentication authentication(String username, String password) {
        UserDetails user = loadUserByUsername(username);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Incorrect username or password");
        }

        // Chequea los 4 flags de la cuenta (enabled, locked, expired, credentials expired)
        new AccountStatusUserDetailsChecker().check(user);

        return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
    }

}
