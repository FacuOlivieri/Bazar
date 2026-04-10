package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Repository.IProductRepository;

import java.util.ArrayList;
import java.util.List;

public class ProductService implements IProductService{

    private final IProductRepository productRepository;

    public ProductService(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {

        Product newProduct =  Product.builder()
                .idProduct(productDTO.getIdProduct())
                .name(productDTO.getName())
                .brand(productDTO.getBrand())
                .quantity(productDTO.getQuantity())
                .price(productDTO.getPrice())
                .build();

        return Mapper.toProductDTO(productRepository.save(newProduct));
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
        product.setName(productDTO.getName());
        product.setBrand(productDTO.getBrand());
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());

        return Mapper.toProductDTO(productRepository.save(product));


    }

    @Override
    public List<ProductDTO> findAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productDTOs = new ArrayList<>();

        products.forEach(product -> productDTOs.add(Mapper.toProductDTO(product)));

        return productDTOs;
    }

    @Override
    public ProductDTO findProduct(Long id) {
        return Mapper.toProductDTO(productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product with id: " + id +"not found")));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
        productRepository.delete(product);
    }
}
