package com.Project.BazarV1.Repository;

import com.Project.BazarV1.Model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ISaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByDate(LocalDate date);
}
