package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Model.Sale;
import com.Project.BazarV1.Model.SaleDetail;
import com.Project.BazarV1.Repository.IClientRepository;
import com.Project.BazarV1.Repository.IProductRepository;
import com.Project.BazarV1.Repository.ISaleRepository;

import java.util.ArrayList;
import java.util.List;

public class SaleService implements ISaleService {


    private ISaleRepository saleRepository;
    private IClientRepository clientRepository;
    private IProductRepository productRepository;

    public SaleService(ISaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @Override
    public SaleDTO createSale(SaleDTO saleDTO) {
        //Para campo calculado
        Double totalSalePrice = 0.0D;
       //Traemos CLiente para asignarlo a la nueva Venta
        Client clienteEncontrado = clientRepository.findById(saleDTO.getClient().getIdClientDTO()).
                orElseThrow(() -> new NotFoundException("Client not Found to add to the sale"));


        //Creamos Venta
        Sale newSale = new Sale();
        newSale.setId(saleDTO.getId());
        newSale.setDate(saleDTO.getDate());
        newSale.setClient(clienteEncontrado);
        newSale.setTotalPrice(saleDTO.getTotalPrice());

        //Tramos lista de Productos pasado por el RequestBody
        List<SaleDetailDTO> listaDeProductosDTO = saleDTO.getProducts();
        List<Product> listaDeProductosAAsignar = new ArrayList<>();

        for (SaleDetailDTO producto : listaDeProductosDTO) {
            Product product = productRepository.findProductByName(producto.getProductName());

            listaDeProductosAAsignar.add(product);
        }

        //Lista de Productos Creadas a lista Detail
        List<SaleDetail> listaDetallesAAsignar = new ArrayList<>();
        for (Product producto : listaDeProductosAAsignar) {
            SaleDetail saleDetail = new SaleDetail();
            saleDetail.setSale(newSale);
            saleDetail.setProduct(producto);
            saleDetail.setQuantity(producto.getQuantity());
            saleDetail.setTotal(producto.getPrice() * producto.getQuantity());
            totalSalePrice += saleDetail.getTotal();
            listaDetallesAAsignar.add(saleDetail);
        }


        //Asignamos lista de detalles creadas a la venta, el campo calculado del precio y la persistimos
        newSale.setProducts(listaDetallesAAsignar);
        newSale.setTotalPrice(totalSalePrice);
        saleRepository.save(newSale);

        return Mapper.toSaleDTO(newSale);
    }

    @Override
    public SaleDTO findSale(Long id, SaleDTO saleDTO) {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found"));
        return Mapper.toSaleDTO(sale);
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
