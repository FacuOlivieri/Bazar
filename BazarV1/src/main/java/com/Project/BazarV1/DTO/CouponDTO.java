package com.Project.BazarV1.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponDTO {

    private Long idCoupon;
    @NotBlank(message = "El nombre del cupon no puede estar vacío")
    private String identifier;
    @Positive(message = "Un cupon no puede tener un descuento nulo o negativo")
    private Double discount;
    private Boolean used;

}
