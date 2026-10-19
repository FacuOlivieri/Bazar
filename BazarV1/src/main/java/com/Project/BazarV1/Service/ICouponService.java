package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.CouponDTO;

import java.util.List;

public interface ICouponService {

    CouponDTO createCoupon(CouponDTO couponDTO);
    CouponDTO updateCoupon(Long id, CouponDTO couponDTO);
    List<CouponDTO> findAllCoupons();
    List<CouponDTO> findUnusedCoupons();
    CouponDTO findCoupon(Long id);
    void deleteCoupon(Long id);

}
