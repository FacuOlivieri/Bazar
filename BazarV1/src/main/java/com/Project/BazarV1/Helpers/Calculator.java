package com.Project.BazarV1.Helpers;

import com.Project.BazarV1.Model.SaleDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Calculator implements ICalculator{

    //Suma los totales de los detalles calculados en el servidor (no confia en lo que manda el cliente)
    @Override
    public Double calculateSaleTotalPrice(List<SaleDetail> details) {
        double totalPrice = 0.0;
        for (SaleDetail detail : details) {
            totalPrice += detail.getTotal();
        }
        return totalPrice;
    }

    @Override
    public Double applyDiscount(Double totalPrice, Double discountPercentage) {
        double discountedPrice = totalPrice * (1 - discountPercentage / 100);
        return Math.round(discountedPrice * 100) / 100.0;
    }
}
