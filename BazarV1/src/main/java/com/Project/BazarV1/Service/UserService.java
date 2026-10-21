package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.UserDTO;
import com.Project.BazarV1.Exception.InvalidUserException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Role;
import com.Project.BazarV1.Model.UserSec;
import com.Project.BazarV1.Repository.IRoleRepository;
import com.Project.BazarV1.Repository.IUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    private static final int MIN_PASSWORD_LENGTH = 8;

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        String username = validateUsername(userDTO.getUsername());
        if (userRepository.existsByUsername(username)) {
            throw new InvalidUserException("Ya existe un usuario con el nombre " + username);
        }

        //Si no mandan los flags, la cuenta arranca habilitada para poder loguearse
        UserSec newUser = UserSec.builder()
                .username(username)
                .password(encodePassword(userDTO.getPassword()))
                .enabled(valueOrDefault(userDTO.getEnabled()))
                .accountNotExpired(valueOrDefault(userDTO.getAccountNotExpired()))
                .accountNotLocked(valueOrDefault(userDTO.getAccountNotLocked()))
                .credentialNotExpired(valueOrDefault(userDTO.getCredentialNotExpired()))
                .rolesList(resolveRoles(userDTO.getRoles()))
                .build();

        return Mapper.toUserDTO(userRepository.save(newUser));
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        UserSec user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el usuario con id " + id));

        String username = validateUsername(userDTO.getUsername());
        if (userRepository.existsByUsernameAndIdUserNot(username, id)) {
            throw new InvalidUserException("Ya existe un usuario con el nombre " + username);
        }
        user.setUsername(username);

        //Los campos que no se mandan conservan su valor actual
        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            user.setPassword(encodePassword(userDTO.getPassword()));
        }
        if (userDTO.getEnabled() != null) {
            user.setEnabled(userDTO.getEnabled());
        }
        if (userDTO.getAccountNotExpired() != null) {
            user.setAccountNotExpired(userDTO.getAccountNotExpired());
        }
        if (userDTO.getAccountNotLocked() != null) {
            user.setAccountNotLocked(userDTO.getAccountNotLocked());
        }
        if (userDTO.getCredentialNotExpired() != null) {
            user.setCredentialNotExpired(userDTO.getCredentialNotExpired());
        }
        if (userDTO.getRoles() != null) {
            user.setRolesList(resolveRoles(userDTO.getRoles()));
        }

        return Mapper.toUserDTO(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> findAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(Mapper::toUserDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findUser(Long id) {
        UserSec user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el usuario con id " + id));

        return Mapper.toUserDTO(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        UserSec user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el usuario con id " + id));

        if (isAuthenticatedUser(user.getUsername())) {
            throw new InvalidUserException("No podés eliminar el usuario con el que estás logueado");
        }
        userRepository.delete(user);
    }

    private String validateUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new InvalidUserException("El nombre de usuario es obligatorio");
        }
        return username.trim();
    }

    //Nunca se guarda en texto plano: BCrypt (bean de SecurityConfig)
    private String encodePassword(String password) {
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw new InvalidUserException("La contraseña debe tener al menos " + MIN_PASSWORD_LENGTH + " caracteres");
        }
        return passwordEncoder.encode(password);
    }

    private boolean valueOrDefault(Boolean value) {
        return value == null || value;
    }

    private Set<Role> resolveRoles(Set<String> roleNames) {
        if (roleNames == null) {
            return new HashSet<>();
        }
        return roleNames.stream()
                .map(name -> name == null ? "" : name.trim().toUpperCase(Locale.ROOT))
                .map(name -> roleRepository.findByRole(name)
                        .orElseThrow(() -> new NotFoundException("No se encontró el rol " + name)))
                .collect(Collectors.toCollection(HashSet::new));
    }

    //El username del token queda como name de la Authentication (ver JwtTokenValidator)
    private boolean isAuthenticatedUser(String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && username.equals(authentication.getName());
    }
}
