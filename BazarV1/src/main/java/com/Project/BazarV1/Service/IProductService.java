package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;

import java.util.List;

public interface IProductService {

    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO findProduct(Long id, ProductDTO productDTO);
    List<ProductDTO> findAllProducts();
    ProductDTO findProduct();
    void deleteProduct(Long id);
}
