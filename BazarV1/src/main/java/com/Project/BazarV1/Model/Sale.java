package com.Project.BazarV1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private Double totalPrice;
    @OneToMany (mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true , fetch = FetchType.EAGER)
    private List<SaleDetail> products;

    @OneToOne
    @JoinColumn(name = "id_client", referencedColumnName = "idClient")
    private Client client;

}
