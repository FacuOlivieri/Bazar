package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Exception.InvalidProductException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Model.Sale;
import com.Project.BazarV1.Model.SaleDetail;
import com.Project.BazarV1.Repository.IProductRepository;
import com.Project.BazarV1.Repository.ISaleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IProductService {

    private final IProductRepository productRepository;
    private final ISaleRepository saleRepository;
    private final Integer LOW_STOCK_QUANTITY = 5;

    public ProductService(IProductRepository productRepository, ISaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {

        if (productDTO.getName() == null || productDTO.getName().isBlank())
            throw new IllegalArgumentException("El nombre del producto es obligatorio");

        if (productDTO.getBrand() == null || productDTO.getBrand().isBlank())
            throw new IllegalArgumentException("La marca del producto es obligatoria");

        if (productDTO.getPrice() == null || productDTO.getPrice() <= 0)
            throw new IllegalArgumentException("El precio del producto debe ser mayor a 0");

        if (productDTO.getQuantity() == null || productDTO.getQuantity() < 0)
            throw new IllegalArgumentException("La cantidad del producto no puede ser negativa");

        if (productDTO.getStock() == null || productDTO.getStock() < 0)
            throw new IllegalArgumentException("El stock del producto no puede ser negativo");

        Product newProduct = Product.builder()
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

        if (id == null || id <= 0)
            throw new InvalidProductException("El id del producto no es válido");

        if (productDTO.getPrice() != null && productDTO.getPrice() <= 0)
            throw new IllegalArgumentException("El precio del producto debe ser mayor a 0");

        if (productDTO.getQuantity() != null && productDTO.getQuantity() < 0)
            throw new IllegalArgumentException("La cantidad del producto no puede ser negativa");

        if (productDTO.getStock() != null && productDTO.getStock() < 0)
            throw new IllegalArgumentException("El stock del producto no puede ser negativo");

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el producto"));

        product.setName(productDTO.getName());
        product.setBrand(productDTO.getBrand());
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());

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

        if (id == null || id <= 0)
            throw new InvalidProductException("El id del producto no es válido");

        return Mapper.toProductDTO(productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el producto con id " + id)));
    }

    @Override
    public void deleteProduct(Long id) {

        if (id == null || id <= 0)
            throw new InvalidProductException("El id del producto no es válido");

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró el producto"));

        productRepository.delete(product);
    }

    @Override
    public List<ProductDTO> findAllLowStockProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productDTOsWithLowStock = new ArrayList<>();

        products.stream()
                .filter(product -> product.getStock() < LOW_STOCK_QUANTITY)
                .forEach(product -> productDTOsWithLowStock.add(Mapper.toProductDTO(product)));

        return productDTOsWithLowStock;
    }

    @Override
    public List<ProductDTO> findProductsFromSpecificSale(Long idSale) {
        Sale specificSale = saleRepository.findById(idSale).orElseThrow(() -> new NotFoundException("No se encontró la venta"));
        List<SaleDetail> detailProducts = specificSale.getProducts();
        List<Product> products = new ArrayList<>();

        //Por cada detalle lo metemos en una lista de Productos
        for (SaleDetail detailProduct : detailProducts) {
            Optional<Product> foundProduct = productRepository.findById(detailProduct.getProduct().getIdProduct());
            foundProduct.ifPresent(products::add);
        }

        //Agregamos cada producto a Lista DTO
        List<ProductDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(Mapper.toProductDTO(product));
        }
        return productDTOs;

    }
}
