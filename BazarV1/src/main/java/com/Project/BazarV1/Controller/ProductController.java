package com.Project.BazarV1.Controller;


import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.Service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/v1/products")
public class ProductController {

    public final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts() {
        return ResponseEntity.ok(productService.findAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findProduct(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDTO> createClient(@RequestBody ProductDTO productDTO) {
        ProductDTO newProductDTO = productService.createProduct(productDTO);
        return ResponseEntity.created(URI.create("/api/v1/products/" + newProductDTO.getIdProduct())).body(newProductDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long idProduct, @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(idProduct, productDTO));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long idProduct) {
        productService.deleteProduct(idProduct);
        return ResponseEntity.noContent().build();
    }

}
