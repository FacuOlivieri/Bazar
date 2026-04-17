package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.SaleDTO;

import java.util.List;

public interface ISaleService {


    SaleDTO createSale(SaleDTO saleDTO);
    SaleDTO updateSale(Long id, SaleDTO saleDTO);
    List<SaleDTO> findAllSales();
    SaleDTO findSale(Long id);
    void deleteSale(Long id);
}
