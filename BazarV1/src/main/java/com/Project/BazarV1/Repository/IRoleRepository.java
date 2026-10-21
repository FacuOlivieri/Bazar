package com.Project.BazarV1.Repository;

import com.Project.BazarV1.Model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRole(String role);
    boolean existsByRole(String role);
    boolean existsByRoleAndIdRoleNot(String role, Long idRole);
    boolean existsByPermissionsList_IdPermission(Long idPermission);
}
