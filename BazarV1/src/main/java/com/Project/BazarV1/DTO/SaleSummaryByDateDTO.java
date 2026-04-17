package com.Project.BazarV1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SaleSummaryByDateDTO {

    private Integer totalSales;
    private Double totalSalePriceAmount;

}
