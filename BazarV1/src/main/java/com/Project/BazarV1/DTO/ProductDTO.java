package com.Project.BazarV1.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long idProduct;
    private String name;
    private String brand;
    private Integer quantity;
    private Double price;
    private Double stock;
}
