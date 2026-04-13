package com.Project.BazarV1.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientDTO {

    private Long idClientDTO;
    private String name;
    private String surname;
    private String dni;

}
