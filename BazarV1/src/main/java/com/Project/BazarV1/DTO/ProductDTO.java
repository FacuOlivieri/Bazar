package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
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

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String name;
    @NotBlank(message = "La marca del producto es obligatoria")
    private String brand;
    private Integer quantity;
    @Positive(message = "El precio del producto debe ser mayor a 0")
    private Double price;

    private Integer stock;
}
