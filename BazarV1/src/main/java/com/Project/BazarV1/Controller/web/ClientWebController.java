package com.Project.BazarV1.Controller.web;

import com.Project.BazarV1.Service.IClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClientWebController {

    @Autowired
    private IClientService clientService;

    @GetMapping("/clientes")
    public String clientes(Model model) {
        model.addAttribute("listaClientes", clientService.findAllClients());
        return "clientes";
    }
}
