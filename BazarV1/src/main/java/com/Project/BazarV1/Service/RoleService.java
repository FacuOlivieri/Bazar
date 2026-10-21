package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.RoleDTO;
import com.Project.BazarV1.Exception.InvalidRoleException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Permission;
import com.Project.BazarV1.Model.Role;
import com.Project.BazarV1.Repository.IPermissionRepository;
import com.Project.BazarV1.Repository.IRoleRepository;
import com.Project.BazarV1.Repository.IUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService implements IRoleService {

    //UserDetailsServiceImp ya agrega este prefijo al armar las authorities
    private static final String ROLE_PREFIX = "ROLE_";

    private final IRoleRepository roleRepository;
    private final IPermissionRepository permissionRepository;
    private final IUserRepository userRepository;

    public RoleService(IRoleRepository roleRepository, IPermissionRepository permissionRepository, IUserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RoleDTO createRole(RoleDTO roleDTO) {
        String roleName = validateRoleName(roleDTO.getRole());
        if (roleRepository.existsByRole(roleName)) {
            throw new InvalidRoleException("Ya existe un rol con el nombre " + roleName);
        }

        Role newRole = Role.builder()
                .role(roleName)
                .permissionsList(resolvePermissions(roleDTO.getPermissions()))
                .build();

        return Mapper.toRoleDTO(roleRepository.save(newRole));
    }

    @Override
    @Transactional
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el rol con id " + id));

        String roleName = validateRoleName(roleDTO.getRole());
        if (roleRepository.existsByRoleAndIdRoleNot(roleName, id)) {
            throw new InvalidRoleException("Ya existe un rol con el nombre " + roleName);
        }

        role.setRole(roleName);
        //Si no mandan permisos se conservan los actuales
        if (roleDTO.getPermissions() != null) {
            role.setPermissionsList(resolvePermissions(roleDTO.getPermissions()));
        }

        return Mapper.toRoleDTO(roleRepository.save(role));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDTO> findAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(Mapper::toRoleDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO findRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el rol con id " + id));

        return Mapper.toRoleDTO(role);
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el rol con id " + id));

        //Si un usuario lo tiene asignado, borrarlo romperia la FK de user_roles
        if (userRepository.existsByRolesList_IdRole(id)) {
            throw new InvalidRoleException("No se puede eliminar el rol " + role.getRole() + " porque está asignado a uno o más usuarios");
        }
        roleRepository.delete(role);
    }

    //Se guarda en mayusculas y sin "ROLE_" para que hasRole("X") funcione
    private String validateRoleName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new InvalidRoleException("El nombre del rol es obligatorio");
        }
        String normalized = roleName.trim().toUpperCase(Locale.ROOT);
        if (normalized.startsWith(ROLE_PREFIX)) {
            throw new InvalidRoleException("El nombre del rol no debe empezar con " + ROLE_PREFIX + ", se agrega automáticamente");
        }
        return normalized;
    }

    private Set<Permission> resolvePermissions(Set<String> permissionNames) {
        if (permissionNames == null) {
            return new HashSet<>();
        }
        return permissionNames.stream()
                .map(name -> name == null ? "" : name.trim().toUpperCase(Locale.ROOT))
                .map(name -> permissionRepository.findByPermissionName(name)
                        .orElseThrow(() -> new NotFoundException("No se encontró el permiso " + name)))
                .collect(Collectors.toCollection(HashSet::new));
    }
}
