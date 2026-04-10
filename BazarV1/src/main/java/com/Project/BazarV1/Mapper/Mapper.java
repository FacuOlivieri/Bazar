package com.Project.BazarV1.Mapper;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.Model.Client;

public class Mapper {

    public static ClientDTO toClientDTO(Client client) {

        return ClientDTO.builder()
                .id(client.getIdClient())
                .name(client.getName())
                .surname(client.getSurname())
                .dni(client.getDni())
                .build();
    }
}
