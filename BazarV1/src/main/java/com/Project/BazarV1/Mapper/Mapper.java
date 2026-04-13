package com.Project.BazarV1.Mapper;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Model.Sale;
import com.Project.BazarV1.Model.SaleDetail;

import java.util.ArrayList;
import java.util.List;

public class Mapper {

    public static ClientDTO toClientDTO(Client client) {

        return ClientDTO.builder()
                .idClientDTO(client.getIdClient())
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

    public static SaleDTO toSaleDTO(Sale sale) {
        return SaleDTO.builder()
                .id(sale.getId())
                .date(sale.getDate())
                .client(toClientDTO(sale.getClient()))
                .products(toSaleDetailDTO(sale.getProducts()))
                .totalPrice(sale.getTotalPrice())
                .build();

    }

    private static List<SaleDetailDTO> toSaleDetailDTO(List<SaleDetail> products) {
        List<SaleDetailDTO> saleDetailDTOs = new ArrayList<>();
        for (SaleDetail product : products) {
            SaleDetailDTO detail = SaleDetailDTO.builder()
                    .id(product.getIdSaleDetail())
                    .productName(product.getProduct().getName())
                    .quantity(product.getQuantity())
                    .subtotal(product.getProduct().getPrice() * product.getQuantity())
                    .build();
                    saleDetailDTOs.add(detail);
        }
        return saleDetailDTOs;
    }
}
