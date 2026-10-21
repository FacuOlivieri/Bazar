package com.Project.BazarV1.Repository;

import com.Project.BazarV1.Model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICouponRepository extends JpaRepository<Coupon, Long> {
    boolean existsByIdentifier(String identifier);
    boolean existsByIdentifierAndIdCouponNot(String identifier, Long idCoupon);
    List<Coupon> findByUsedFalse();
    Optional<Coupon> findByIdentifier(String identifier);
}
