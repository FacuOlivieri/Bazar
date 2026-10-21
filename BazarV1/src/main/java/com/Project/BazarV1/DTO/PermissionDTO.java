package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PermissionDTO {

    private Long idPermission;

    @NotBlank(message = "El nombre del permiso es obligatorio")
    private String permissionName;

}
