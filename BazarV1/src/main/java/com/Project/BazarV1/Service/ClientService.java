package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.Exception.InvalidClientException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Repository.IClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService implements IClientService {

    //Separadores que se aceptan al escribir un telefono y se quitan antes de guardarlo
    private static final String PHONE_SEPARATORS = "[\\s\\-().]";
    //Un "+" opcional adelante (ej: +54) y despues solo digitos
    private static final String PHONE_PATTERN = "\\+?\\d+";

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
               .phone(validatePhone(clientDTO.getPhone()))
               .adress(clientDTO.getAdress())
               .email(clientDTO.getEmail())
               .dni(clientDTO.getDni())
               .build();


        return Mapper.toClientDTO(clientRepository.save(newClient));
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id).orElseThrow( () -> new NotFoundException("No se encontró el cliente"));
        client.setName(clientDTO.getName());
        client.setSurname(clientDTO.getSurname());
        client.setDni(clientDTO.getDni());
        client.setPhone(validatePhone(clientDTO.getPhone()));
        client.setEmail(clientDTO.getEmail());
        client.setAdress(clientDTO.getAdress());


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
                .orElseThrow( () -> new NotFoundException("No se encontró el cliente con id " + id));

       return Mapper.toClientDTO(client);

    }

    @Override
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id).orElseThrow( () -> new NotFoundException("No se encontró el cliente con id " + id));
        clientRepository.delete(client);
    }


    private String validatePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }
        String normalized = phone.replaceAll(PHONE_SEPARATORS, "");
        if (!normalized.matches(PHONE_PATTERN)) {
            throw new InvalidClientException("El teléfono solo puede tener números. Valor recibido: " + phone);
        }
        return normalized;
    }
}
