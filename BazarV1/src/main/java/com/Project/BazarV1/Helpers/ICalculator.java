package com.Project.BazarV1.Helpers;

import com.Project.BazarV1.Model.SaleDetail;

import java.util.List;

public interface ICalculator {
    Double calculateSaleTotalPrice(List<SaleDetail> details);
    Double applyDiscount(Double totalPrice, Double discountPercentage);
}
