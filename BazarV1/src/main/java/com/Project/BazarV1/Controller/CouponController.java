package com.Project.BazarV1.Controller;


import com.Project.BazarV1.DTO.CouponDTO;
import com.Project.BazarV1.Service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/v1/coupons")
public class CouponController {

    public final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }


    @GetMapping
    public ResponseEntity<List<CouponDTO>> getCoupons() {
        return ResponseEntity.ok(couponService.findAllCoupons());
    }

    @GetMapping("/unused")
    public ResponseEntity<List<CouponDTO>> getUnusedCoupons() {
        return ResponseEntity.ok(couponService.findUnusedCoupons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponDTO> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.findCoupon(id));
    }

    @PostMapping("/create")
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO couponDTO) {
        CouponDTO newCouponDTO = couponService.createCoupon(couponDTO);
        return ResponseEntity.created(URI.create("/api/v1/coupons/" + newCouponDTO.getIdCoupon())).body(newCouponDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponDTO> updateCoupon(@PathVariable Long id, @RequestBody CouponDTO couponDTO) {
        return ResponseEntity.ok(couponService.updateCoupon(id, couponDTO));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<CouponDTO> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

}
