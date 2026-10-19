package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.SaleDTO;

public interface ICalculator {
    Double calculateSaleTotalPrice(SaleDTO saleDTO);
    Double applyDiscount(Double totalPrice, Double discountPercentage);
}
