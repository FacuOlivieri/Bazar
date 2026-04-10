package com.Project.BazarV1.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleDTO {

    private Long id;
    private LocalDate date;
    private ClientDTO client;
    private List<SaleDetailDTO> products;
    private Double totalPrice;
}
