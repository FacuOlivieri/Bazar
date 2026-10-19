package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.CouponDTO;
import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;
import com.Project.BazarV1.Exception.InvalidCouponException;
import com.Project.BazarV1.Exception.NotEnoughStock;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Helpers.Calculator;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Model.Coupon;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Model.Sale;
import com.Project.BazarV1.Model.SaleDetail;
import com.Project.BazarV1.Repository.IClientRepository;
import com.Project.BazarV1.Repository.ICouponRepository;
import com.Project.BazarV1.Repository.IProductRepository;
import com.Project.BazarV1.Repository.ISaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SaleService implements ISaleService {


    private final ISaleRepository saleRepository;
    private final IClientRepository clientRepository;
    private final IProductRepository productRepository;
    private final ICouponRepository couponRepository;
    private final Calculator calculator;

    public SaleService(ISaleRepository saleRepository,  IClientRepository clientRepository, IProductRepository productRepository, ICouponRepository couponRepository, Calculator calculator) {
        this.saleRepository = saleRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.calculator = calculator;
    }

    @Override
    @Transactional
    public SaleDTO createSale(SaleDTO saleDTO) {

        //Lista de productos pasados -- Verificacion de Stock
        List<SaleDetailDTO> listaDeProductosDTO = saleDTO.getProducts();
        validacionStockProductos(listaDeProductosDTO);

        //Cupon opcional -- se valida antes de tocar stock
        Coupon cupon = buscarCuponDisponible(saleDTO.getCoupon());

       //Traemos Cliente para asignarlo a la nueva Venta
        Client clienteEncontrado = clientRepository.findById(saleDTO.getClient().getIdClientDTO()).
                orElseThrow(() -> new NotFoundException("No se encontró el cliente de la venta"));


        //Creamos Venta
        Sale newSale = new Sale();
        newSale.setDate(saleDTO.getDate());
        newSale.setClient(clienteEncontrado);


        //Asignamos Detalles segun lo pasado
        List<SaleDetail> listaDetallesAAsignar = new ArrayList<>();

        for (SaleDetailDTO productoDTO : listaDeProductosDTO) {
            Product product = productRepository.findById(productoDTO.getId()).orElseThrow(() -> new NotFoundException("No se encontró un producto de la venta"));
            product.setStock(product.getStock() - productoDTO.getQuantity());

            listaDetallesAAsignar.add(crearDetalle(newSale, product, product.getPrice(), productoDTO.getQuantity()));
        }

        //Total calculado en el servidor a partir de los detalles
        Double totalSalePrice = calculator.calculateSaleTotalPrice(listaDetallesAAsignar);

        //Si vino cupon, aplicamos el descuento y lo marcamos como usado
        if (cupon != null) {
            totalSalePrice = calculator.applyDiscount(totalSalePrice, cupon.getDiscount());
            cupon.setUsed(true);
            newSale.setCoupon(cupon);
        }

        //Asignamos lista de detalles creadas a la venta, el campo calculado del precio y la persistimos
        newSale.setProducts(listaDetallesAAsignar);
        newSale.setTotalPrice(totalSalePrice);
        saleRepository.save(newSale);

        return Mapper.toSaleDTO(newSale);
    }

    //Arma un detalle guardando nombre y precio del producto, para que la venta no cambie si despues se modifica el producto
    private SaleDetail crearDetalle(Sale sale, Product product, Double unitPrice, Integer quantity) {
        SaleDetail saleDetail = new SaleDetail();
        saleDetail.setSale(sale);
        saleDetail.setProduct(product);
        saleDetail.setProductName(product.getName());
        saleDetail.setUnitPrice(unitPrice);
        saleDetail.setQuantity(quantity);
        saleDetail.setTotal(unitPrice * quantity);
        return saleDetail;
    }

    private Coupon buscarCuponDisponible(CouponDTO couponDTO) {
        if (couponDTO == null || couponDTO.getIdentifier() == null || couponDTO.getIdentifier().isBlank()) {
            return null;
        }
        String identifier = couponDTO.getIdentifier().trim();
        Coupon cupon = couponRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new NotFoundException("No se encontró el cupón " + identifier));
        if (cupon.getUsed()) {
            throw new InvalidCouponException("El cupón " + identifier + " ya fue usado");
        }
        return cupon;
    }

    private void validacionStockProductos(List<SaleDetailDTO> listaDeProductosDTO) {
        for (SaleDetailDTO productoPasado : listaDeProductosDTO) {
            Optional<Product> productoEnStock = productRepository.findById(productoPasado.getId());
            if (productoEnStock.isPresent() && productoPasado.getQuantity() > productoEnStock.get().getStock()) {
                throw new NotEnoughStock("No alcanza el stock de " + productoEnStock.get().getName() + ": quedan " + productoEnStock.get().getStock());
            }
        }
    }

    @Override
    @Transactional
    public SaleDTO updateSale(Long id, SaleDTO saleDTO) {
        Sale foundSale = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("No se encontró la venta"));
        Client updatedClient = clientRepository.findById(saleDTO.getClient().getIdClientDTO()).orElseThrow(() -> new NotFoundException("No se encontró el cliente de la venta"));

        //Guardamos el precio al que se vendio cada producto originalmente (id producto -> precio)
        Map<Long, Double> preciosOriginales = new HashMap<>();
        for (SaleDetail detalleOriginal : foundSale.getProducts()) {
            preciosOriginales.put(detalleOriginal.getProduct().getIdProduct(), detalleOriginal.getUnitPrice());
        }

        List<SaleDetailDTO> productsDTOList = saleDTO.getProducts();
        List<SaleDetail> detailsListToAsigne = new ArrayList<>();

        //Crea objeto Producto por cada producto pasado por el body de request, creamos cada SaleDetail y agregamos a su correspondiente lista a asignar
        for (SaleDetailDTO saleDetailProducto : productsDTOList) {
            Product product = productRepository.findById(saleDetailProducto.getId())
                    .orElseThrow(() -> new NotFoundException("No se encontró el producto " + saleDetailProducto.getProductName()));

            //Si el producto ya estaba en la venta se respeta su precio original, si es nuevo se usa el precio actual
            Double unitPrice = preciosOriginales.get(product.getIdProduct());
            if (unitPrice == null) {
                unitPrice = product.getPrice();
            }

            detailsListToAsigne.add(crearDetalle(foundSale, product, unitPrice, saleDetailProducto.getQuantity()));
        }

        //Total calculado en el servidor, aplicando el cupon si la venta tenia uno
        Double totalPrice = calculator.calculateSaleTotalPrice(detailsListToAsigne);
        if (foundSale.getCoupon() != null) {
            totalPrice = calculator.applyDiscount(totalPrice, foundSale.getCoupon().getDiscount());
        }


        foundSale.setDate(saleDTO.getDate());
        foundSale.setClient(updatedClient);
        foundSale.getProducts().clear();
        foundSale.getProducts().addAll(detailsListToAsigne);
        foundSale.setTotalPrice(totalPrice);


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
        return Mapper.toSaleDTO(saleRepository.findById(id).orElseThrow(() -> new NotFoundException("No se encontró la venta")));
    }

    @Override
    public void deleteSale(Long id) {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("No se encontró la venta"));
        saleRepository.delete(sale);
    }

    @Override
    public Integer saleQuantity(LocalDate date) {
        List<Sale> sales = saleRepository.findByDate(date);
        return sales.size();
    }

    @Override
    public Double totalSalePriceAmount(LocalDate date) {
        List<Sale> sales = saleRepository.findByDate(date);
        return sales.stream().mapToDouble(Sale::getTotalPrice).sum();
    }


}
