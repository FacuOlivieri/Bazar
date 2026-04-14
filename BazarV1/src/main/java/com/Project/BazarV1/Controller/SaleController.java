package com.Project.BazarV1.Controller;

import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.Service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/v1/sales")
public class SaleController {

    private final SaleService saleService;
    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> getAllSales() {
        return ResponseEntity.ok(saleService.findAllSales());
    }

    @GetMapping("{id}")
    public ResponseEntity<SaleDTO> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.findSale(id));
    }

    @PostMapping("/create")
    public ResponseEntity<SaleDTO> createSale(@RequestBody SaleDTO saleDTO) {
        SaleDTO sale = saleService.createSale(saleDTO);
        return ResponseEntity.created(URI.create("api/v1/sales/" + sale.getId())).body(sale);
    }

    @PutMapping("{id}")
    public ResponseEntity<SaleDTO> updateSale(@RequestBody SaleDTO saleDTO, @PathVariable Long id) {
        return ResponseEntity.ok(saleService.updateSale(id, saleDTO));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        saleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }



}
