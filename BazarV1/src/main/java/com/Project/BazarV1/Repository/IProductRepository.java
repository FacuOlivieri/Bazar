package com.Project.BazarV1.Repository;

import com.Project.BazarV1.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findProductByName(String name);
}
