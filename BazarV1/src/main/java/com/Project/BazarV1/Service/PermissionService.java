package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.PermissionDTO;
import com.Project.BazarV1.Exception.InvalidPermissionException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Permission;
import com.Project.BazarV1.Repository.IPermissionRepository;
import com.Project.BazarV1.Repository.IRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class PermissionService implements IPermissionService {

    private final IPermissionRepository permissionRepository;
    private final IRoleRepository roleRepository;

    public PermissionService(IPermissionRepository permissionRepository, IRoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public PermissionDTO createPermission(PermissionDTO permissionDTO) {
        String permissionName = validatePermissionName(permissionDTO.getPermissionName());
        if (permissionRepository.existsByPermissionName(permissionName)) {
            throw new InvalidPermissionException("Ya existe un permiso con el nombre " + permissionName);
        }

        Permission newPermission = Permission.builder()
                .permissionName(permissionName)
                .build();

        return Mapper.toPermissionDTO(permissionRepository.save(newPermission));
    }

    @Override
    @Transactional
    public PermissionDTO updatePermission(Long id, PermissionDTO permissionDTO) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el permiso con id " + id));

        String permissionName = validatePermissionName(permissionDTO.getPermissionName());
        if (permissionRepository.existsByPermissionNameAndIdPermissionNot(permissionName, id)) {
            throw new InvalidPermissionException("Ya existe un permiso con el nombre " + permissionName);
        }

        permission.setPermissionName(permissionName);

        return Mapper.toPermissionDTO(permissionRepository.save(permission));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findAllPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(Mapper::toPermissionDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDTO findPermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el permiso con id " + id));

        return Mapper.toPermissionDTO(permission);
    }

    @Override
    @Transactional
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el permiso con id " + id));

        //Si un rol lo tiene asignado, borrarlo romperia la FK de roles_permissions
        if (roleRepository.existsByPermissionsList_IdPermission(id)) {
            throw new InvalidPermissionException("No se puede eliminar el permiso " + permission.getPermissionName() + " porque está asignado a uno o más roles");
        }
        permissionRepository.delete(permission);
    }

    //Se guarda en mayusculas para que hasAuthority("X") matchee sin importar como se escribio
    private String validatePermissionName(String permissionName) {
        if (permissionName == null || permissionName.isBlank()) {
            throw new InvalidPermissionException("El nombre del permiso es obligatorio");
        }
        return permissionName.trim().toUpperCase(Locale.ROOT);
    }
}
