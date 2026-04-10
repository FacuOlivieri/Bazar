package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ClientDTO;

import java.util.List;

public interface IClientService {

    ClientDTO createClient( ClientDTO clientDTO);
    ClientDTO updateClient(Long id, ClientDTO clientDTO);
    List<ClientDTO> findAllClients();
    ClientDTO findClient(Long id);
    void deleteClient(Long id);

}
