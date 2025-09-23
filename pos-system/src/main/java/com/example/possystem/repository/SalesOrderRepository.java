package com.example.possystem.repository;

import com.example.possystem.domain.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByOrderDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}