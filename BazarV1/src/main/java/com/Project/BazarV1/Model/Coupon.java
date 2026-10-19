package com.Project.BazarV1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCoupon;
    @Column(nullable = false, unique = true)
    private String identifier;
    @Column(nullable = false)
    private Double discount;
    @Column(nullable = false)
    private Boolean used;


}
