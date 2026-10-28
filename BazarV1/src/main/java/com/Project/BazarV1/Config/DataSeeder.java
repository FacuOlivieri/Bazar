package com.Project.BazarV1.Config;

import com.Project.BazarV1.Model.Role;
import com.Project.BazarV1.Model.UserSec;
import com.Project.BazarV1.Repository.IRoleRepository;
import com.Project.BazarV1.Repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

// Carga inicial: si la base no tiene usuarios (ej: base nueva en produccion),
// crea los roles ADMIN y EMPLEADO y un usuario admin para poder loguearse
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${security.admin.username}")
    private String adminUsername;

    @Value("${security.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        Role admin = this.findOrCreateRole("ADMIN");
        this.findOrCreateRole("EMPLEADO");

        userRepository.save(UserSec.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .enabled(true)
                .accountNotExpired(true)
                .accountNotLocked(true)
                .credentialNotExpired(true)
                .rolesList(new HashSet<>(Set.of(admin)))
                .build());
    }

    private Role findOrCreateRole(String name) {
        return roleRepository.findByRole(name)
                .orElseGet(() -> roleRepository.save(Role.builder().role(name).build()));
    }

}
