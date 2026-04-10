package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.Repository.IClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService implements IClientService {

    private IClientRepository clientRepository;

    public ClientService(IClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }



    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        return null;
    }

    @Override
    public ClientDTO findClient(Long id, ClientDTO clientDTO) {
        return null;
    }

    @Override
    public List<ClientDTO> findAllClients() {
        return List.of();
    }

    @Override
    public ClientDTO findClient() {
        return null;
    }

    @Override
    public void deleteClient(Long id) {

    }
}
