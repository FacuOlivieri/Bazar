package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.Repository.ISaleRepository;

import java.util.List;

public class SaleService implements ISaleService {


    private ISaleRepository saleRepository;

    public SaleService(ISaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }


    @Override
    public SaleDTO createSale(SaleDTO saleDTO) {
        return null;
    }

    @Override
    public SaleDTO findSale(Long id, SaleDTO saleDTO) {
        return null;
    }

    @Override
    public List<SaleDTO> findAllSales() {
        return List.of();
    }

    @Override
    public SaleDTO findSale(Long id) {
        return null;
    }

    @Override
    public void deleteSale(Long id) {

    }
}
