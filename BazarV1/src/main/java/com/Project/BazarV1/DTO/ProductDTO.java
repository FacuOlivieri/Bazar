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

    @NotBlank
    private String name;
    @NotBlank
    private String brand;
    private Integer quantity;
    @Positive
    private Double price;

    private Integer stock;
}
