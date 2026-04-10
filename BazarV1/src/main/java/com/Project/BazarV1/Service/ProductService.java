package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Repository.IProductRepository;

import java.util.List;

public class ProductService implements IProductService{

    private IProductRepository productRepository;

    public ProductService(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        return null;
    }

    @Override
    public ProductDTO findProduct(Long id, ProductDTO productDTO) {
        return null;
    }

    @Override
    public List<ProductDTO> findAllProducts() {
        return List.of();
    }

    @Override
    public ProductDTO findProduct() {
        return null;
    }

    @Override
    public void deleteProduct(Long id) {

    }
}
