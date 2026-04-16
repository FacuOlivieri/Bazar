package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;

import java.util.List;

public interface IProductService {

    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    List<ProductDTO> findAllProducts();
    ProductDTO findProduct(Long id);
    void deleteProduct(Long id);
    List<ProductDTO> findAllLowStockProducts();
}
