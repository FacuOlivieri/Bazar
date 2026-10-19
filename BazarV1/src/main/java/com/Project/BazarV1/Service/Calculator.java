package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;
import org.springframework.stereotype.Service;

@Service
public class Calculator implements ICalculator{

    @Override
    public Double calculateSaleTotalPrice(SaleDTO saleDTO) {
        double totalPrice = 0.0;
        for (SaleDetailDTO saleDetailProduct : saleDTO.getProducts()) {
            totalPrice += saleDetailProduct.getSubtotal();
        }
        return totalPrice;
    }

    //Redondea a 2 decimales para evitar valores como 1111.0500000000002
    @Override
    public Double applyDiscount(Double totalPrice, Double discountPercentage) {
        double discountedPrice = totalPrice * (1 - discountPercentage / 100);
        return Math.round(discountedPrice * 100) / 100.0;
    }
}
