package com.Project.BazarV1.Controller;

import com.Project.BazarV1.DTO.PermissionDTO;
import com.Project.BazarV1.Service.IPermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

//Gestion de seguridad: solo el ADMIN, el EMPLEADO recibe 403
@RestController
@RequestMapping("api/v1/permissions")
@PreAuthorize("hasRole('ADMIN')")
public class PermissionController {

    private final IPermissionService permissionService;

    public PermissionController(IPermissionService permissionService) {
        this.permissionService = permissionService;
    }


    @GetMapping
    public ResponseEntity<List<PermissionDTO>> getPermissions() {
        return ResponseEntity.ok(permissionService.findAllPermissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionDTO> getPermissionById(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.findPermission(id));
    }

    @PostMapping("/create")
    public ResponseEntity<PermissionDTO> createPermission(@RequestBody PermissionDTO permissionDTO) {
        PermissionDTO newPermissionDTO = permissionService.createPermission(permissionDTO);
        return ResponseEntity.created(URI.create("/api/v1/permissions/" + newPermissionDTO.getIdPermission())).body(newPermissionDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PermissionDTO> updatePermission(@PathVariable Long id, @RequestBody PermissionDTO permissionDTO) {
        return ResponseEntity.ok(permissionService.updatePermission(id, permissionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }

}
