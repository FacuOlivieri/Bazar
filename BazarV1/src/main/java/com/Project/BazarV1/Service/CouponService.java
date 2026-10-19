package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.CouponDTO;
import com.Project.BazarV1.Exception.InvalidCouponException;
import com.Project.BazarV1.Exception.NotFoundException;
import com.Project.BazarV1.Mapper.Mapper;
import com.Project.BazarV1.Model.Coupon;
import com.Project.BazarV1.Repository.ICouponRepository;
import com.Project.BazarV1.Repository.ISaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CouponService implements ICouponService {

    private static final double MIN_DISCOUNT = 0;
    private static final double MAX_DISCOUNT = 100;

    private final ICouponRepository couponRepository;
    private final ISaleRepository saleRepository;

    public CouponService(ICouponRepository couponRepository, ISaleRepository saleRepository) {
        this.couponRepository = couponRepository;
        this.saleRepository = saleRepository;
    }

    @Override
    @Transactional
    public CouponDTO createCoupon(CouponDTO couponDTO) {
        String identifier = validateIdentifier(couponDTO.getIdentifier());
        if (couponRepository.existsByIdentifier(identifier)) {
            throw new InvalidCouponException("Ya existe un cupon con el identificador " + identifier);
        }

        //Todo cupon nuevo arranca sin usar
        Coupon newCoupon = Coupon.builder()
                .identifier(identifier)
                .discount(validateDiscount(couponDTO.getDiscount()))
                .used(false)
                .build();

        return Mapper.toCouponDTO(couponRepository.save(newCoupon));
    }

    @Override
    @Transactional
    public CouponDTO updateCoupon(Long id, CouponDTO couponDTO) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new NotFoundException("Coupon not found"));

        String identifier = validateIdentifier(couponDTO.getIdentifier());
        if (couponRepository.existsByIdentifierAndIdCouponNot(identifier, id)) {
            throw new InvalidCouponException("Ya existe un cupon con el identificador " + identifier);
        }

        coupon.setIdentifier(identifier);
        if (couponDTO.getDiscount() != null) {
            coupon.setDiscount(validateDiscount(couponDTO.getDiscount()));
        }
        if (couponDTO.getUsed() != null) {
            coupon.setUsed(couponDTO.getUsed());
        }

        return Mapper.toCouponDTO(couponRepository.save(coupon));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDTO> findAllCoupons() {
        return couponRepository.findAll()
                .stream()
                .map(Mapper::toCouponDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDTO> findUnusedCoupons() {
        return couponRepository.findByUsedFalse()
                .stream()
                .map(Mapper::toCouponDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDTO findCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cannot find coupon with id " + id));

        return Mapper.toCouponDTO(coupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new NotFoundException("Cannot find coupon with id " + id));

        //Si una venta lo usa, borrarlo romperia la FK de la venta
        if (saleRepository.existsByCoupon_IdCoupon(id)) {
            throw new InvalidCouponException("No se puede eliminar el cupon " + coupon.getIdentifier() + " porque esta asociado a una venta");
        }
        couponRepository.delete(coupon);
    }

    private String validateIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new InvalidCouponException("El identificador del cupon es obligatorio");
        }
        return identifier.trim();
    }

    //Porcentaje: mayor a 0 y hasta 100
    private Double validateDiscount(Double discount) {
        if (discount == null || discount <= MIN_DISCOUNT || discount > MAX_DISCOUNT) {
            throw new InvalidCouponException("El porcentaje de descuento debe ser mayor a " + MIN_DISCOUNT + " y menor o igual a " + MAX_DISCOUNT);
        }
        return discount;
    }
}
