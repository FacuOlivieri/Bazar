package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleDTO {

    private Long idRole;

    @NotBlank(message = "El nombre del rol es obligatorio")
    private String role;

    //Nombres de los permisos (ej: "READ", "CREATE")
    private Set<String> permissions;

}
