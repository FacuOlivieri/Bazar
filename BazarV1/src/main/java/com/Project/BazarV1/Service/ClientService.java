package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Repository.IClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService implements IClientService {

    private final IClientRepository clientRepository;

    public ClientService(IClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }



    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {

       Client newClient =  Client.builder()
               .idClient(clientDTO.getIdClientDTO())
               .name(clientDTO.getName())
               .surname(clientDTO.getSurname())
               .dni(clientDTO.getDni())
               .build();


        return Mapper.toClientDTO(clientRepository.save(newClient));
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id).orElseThrow( () -> new NotFoundException("Client not found"));
        client.setName(clientDTO.getName());
        client.setSurname(clientDTO.getSurname());
        client.setDni(clientDTO.getDni());



        return Mapper.toClientDTO(clientRepository.save(client));
    }

    @Override
    public List<ClientDTO> findAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(Mapper::toClientDTO)
                .toList();
    }

    @Override
    public ClientDTO findClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow( () -> new NotFoundException("Cannot find client with id !"));

       return Mapper.toClientDTO(client);

    }

    @Override
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id).orElseThrow( () -> new NotFoundException("Cannot find client with id !"));
        clientRepository.delete(client);
    }
}
