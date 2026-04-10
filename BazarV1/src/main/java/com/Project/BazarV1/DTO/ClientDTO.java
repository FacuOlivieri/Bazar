package com.Project.BazarV1.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientDTO {

    private int id;
    private String nome;
    private String surname;
    private String dni;

}
