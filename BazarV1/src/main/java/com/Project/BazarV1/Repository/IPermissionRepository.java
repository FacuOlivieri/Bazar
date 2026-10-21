package com.Project.BazarV1.Repository;

import com.Project.BazarV1.Model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByPermissionName(String permissionName);
    boolean existsByPermissionName(String permissionName);
    boolean existsByPermissionNameAndIdPermissionNot(String permissionName, Long idPermission);
}
