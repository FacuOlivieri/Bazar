package com.Project.BazarV1.Service;

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


    private final ISaleRepository saleRepository;
    private final IClientRepository clientRepository;
    private final IProductRepository productRepository;
    private final Calculator calculator;

    public SaleService(ISaleRepository saleRepository,  IClientRepository clientRepository, IProductRepository productRepository, Calculator calculator) {
        this.saleRepository = saleRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.calculator = calculator;
    }

    @Override
    public SaleDTO createSale(SaleDTO saleDTO) {
        //Para campo calculado
        Double totalSalePrice = 0.0D;
       //Traemos Cliente para asignarlo a la nueva Venta
        Client clienteEncontrado = clientRepository.findById(saleDTO.getClient().getIdClientDTO()).
                orElseThrow(() -> new NotFoundException("Client not Found to add to the sale"));


        //Creamos Venta
        Sale newSale = new Sale();
        newSale.setId(saleDTO.getId());
        newSale.setDate(saleDTO.getDate());
        newSale.setClient(clienteEncontrado);


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
    public SaleDTO updateSale(Long id, SaleDTO saleDTO) {
        Sale foundSale = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found"));
        Client updatedClient = clientRepository.findById(saleDTO.getClient().getIdClientDTO()).orElseThrow(() -> new NotFoundException("Client not Found to add to the sale"));

        List<SaleDetailDTO> productsDTOList = saleDTO.getProducts();
        List<Product> productsToAsigne = new ArrayList<>();
        List<SaleDetail> detailsListToAsigne = new ArrayList<>();

        //Crea objeto Producto por cada producto pasado por el body de request, y lo pone en su lista
        for (SaleDetailDTO saleDetailProducto : productsDTOList) {
            Product product = productRepository.findProductByName(saleDetailProducto.getProductName());
            productsToAsigne.add(product);
        }

        //De la lista de productos, creamos cada SaleDetail y agregamos a su correspondiente lista a asignar
        for (Product product : productsToAsigne ) {
            SaleDetail saleDetail = new SaleDetail();
            saleDetail.setSale(foundSale);
            saleDetail.setProduct(product);
            saleDetail.setQuantity(product.getQuantity());
            saleDetail.setTotal(product.getPrice() * product.getQuantity());
            detailsListToAsigne.add(saleDetail);
        }

        //Asignamos al la venta a modificar los datos nuevos
        foundSale.setDate(saleDTO.getDate());
        foundSale.setClient(updatedClient);
        foundSale.setProducts(detailsListToAsigne);
        foundSale.setTotalPrice(calculator.calculateSaleTotalPrice(saleDTO));

        //Persistimos y devolvemos
        saleRepository.save(foundSale);
        return Mapper.toSaleDTO(foundSale);

    }

    @Override
    public List<SaleDTO> findAllSales() {
        List<Sale> sales = saleRepository.findAll();
        List<SaleDTO> saleDTOs = new ArrayList<>();
        for (Sale sale : sales) {
            saleDTOs.add(Mapper.toSaleDTO(sale));
        }
        return saleDTOs;
    }

    @Override
    public SaleDTO findSale(Long id) {
        return Mapper.toSaleDTO(saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found")));
    }

    @Override
    public void deleteSale(Long id) {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found"));
        saleRepository.delete(sale);
    }
}
