package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Repository.IProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService implements IProductService{

    private final IProductRepository productRepository;
    private final Integer LOW_STOCK_QUANTITY = 5;

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
                .stock(productDTO.getStock())
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

    @Override
    public List<ProductDTO> findAllLowStockProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productDTOsWithLowStock = new ArrayList<>();

        products.stream()
                .filter(product -> product.getStock() < LOW_STOCK_QUANTITY)
                .forEach(product -> {productDTOsWithLowStock.add(Mapper.toProductDTO(product));});
        return productDTOsWithLowStock;
    }
}
