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
public class SaleDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSaleDetail;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product")
    private Product product;
    private Integer quantity;
    private Double total;

}
