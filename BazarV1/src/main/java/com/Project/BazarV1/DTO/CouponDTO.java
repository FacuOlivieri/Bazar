package com.Project.BazarV1.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponDTO {

    private Long idCoupon;
    private String identifier;
    private Double discount;
    private Boolean used;

}
