package com.Project.BazarV1.Mapper;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Model.Product;

public class Mapper {

    public static ClientDTO toClientDTO(Client client) {

        return ClientDTO.builder()
                .id(client.getIdClient())
                .name(client.getName())
                .surname(client.getSurname())
                .dni(client.getDni())
                .build();
    }

    public static ProductDTO toProductDTO(Product product) {
        return ProductDTO.builder()
                .idProduct(product.getIdProduct())
                .name(product.getName())
                .brand(product.getBrand())
                .quantity(product.getQuantity())
                .price(product.getPrice())
                .stock(product.getStock())
                .build();


    }
}
