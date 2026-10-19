package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientDTO {

    private Long idClientDTO;

    @NotBlank
    private String name;
    @NotBlank
    private String surname;
    private String adress;
    @NotBlank
    private String dni;
    private String phone;
    private String email;

}
