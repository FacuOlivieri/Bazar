package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.RoleDTO;

import java.util.List;

public interface IRoleService {

    RoleDTO createRole(RoleDTO roleDTO);
    RoleDTO updateRole(Long id, RoleDTO roleDTO);
    List<RoleDTO> findAllRoles();
    RoleDTO findRole(Long id);
    void deleteRole(Long id);

}
