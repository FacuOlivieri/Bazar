package com.Project.BazarV1.Controller;


import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.Service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping ("api/v1/clients")
public class ClientController {

    public final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    @GetMapping
    public ResponseEntity<List<ClientDTO>> getClients() {
        return ResponseEntity.ok(clientService.findAllClients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findClient(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        ClientDTO newClientDTO = clientService.createClient(clientDTO);
        return ResponseEntity.created(URI.create("/api/v1/clients/" + newClientDTO.getId())).body(newClientDTO);
    }

    @PutMapping
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long idClient, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(idClient, clientDTO));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ClientDTO> deleteClient(@PathVariable Long idClient) {
        clientService.deleteClient(idClient);
        return ResponseEntity.noContent().build();
    }

}
