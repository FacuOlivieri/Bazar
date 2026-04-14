package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;

public class Calculator implements ICalculator{

    @Override
    public Double calculateSaleTotalPrice(SaleDTO saleDTO) {
        double totalPrice = 0.0;
        for (SaleDetailDTO saleDetailProduct : saleDTO.getProducts()) {
            totalPrice += saleDetailProduct.getSubtotal() * saleDetailProduct.getQuantity();
        }
        return totalPrice;
    }
}
