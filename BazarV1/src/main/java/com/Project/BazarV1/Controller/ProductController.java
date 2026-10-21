package com.Project.BazarV1.Controller;


import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

//ADMIN y EMPLEADO por defecto; los metodos con su propio @PreAuthorize lo reemplazan
@RestController
@RequestMapping("api/v1/products")
@PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
public class ProductController {

    public final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts() {
        return ResponseEntity.ok(productService.findAllProducts());
    }

    @GetMapping("/low_stock")
    public ResponseEntity<List<ProductDTO>> getProductsWithLowStock() {
        return ResponseEntity.ok(productService.findAllLowStockProducts());
    }

    @GetMapping("/specificSale/{idVenta}")
    public ResponseEntity<List<ProductDTO>> getProductsInSpecificSale(@PathVariable Long idVenta) {
        return ResponseEntity.ok(productService.findProductsFromSpecificSale(idVenta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findProduct(id));
    }

    //Precios y stock los maneja solo el ADMIN
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO newProductDTO = productService.createProduct(productDTO);
        return ResponseEntity.created(URI.create("/api/v1/products/" + newProductDTO.getIdProduct())).body(newProductDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }




}
