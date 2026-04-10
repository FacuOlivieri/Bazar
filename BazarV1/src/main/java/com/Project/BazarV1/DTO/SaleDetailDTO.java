package com.Project.BazarV1.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleDetailDTO {

   private Long id;
   private String productName;
   private Integer quantity;
   private Double subtotal;

}
