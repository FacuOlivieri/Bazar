package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientDTO {

    private Long idClientDTO;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    @NotBlank(message = "El apellido es obligatorio")
    private String surname;
    private String adress;
    @NotBlank(message = "El DNI es obligatorio")
    private String dni;
    private String phone;
    private String email;

}
