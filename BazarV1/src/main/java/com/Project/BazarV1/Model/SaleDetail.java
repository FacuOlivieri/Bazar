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

    //Copia del nombre y precio del producto al momento de la venta,
    //asi la venta no cambia si despues se modifica el producto
    private String productName;
    private Double unitPrice;

    private Integer quantity;
    private Double total;

}
