package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.PermissionDTO;

import java.util.List;

public interface IPermissionService {

    PermissionDTO createPermission(PermissionDTO permissionDTO);
    PermissionDTO updatePermission(Long id, PermissionDTO permissionDTO);
    List<PermissionDTO> findAllPermissions();
    PermissionDTO findPermission(Long id);
    void deletePermission(Long id);

}
