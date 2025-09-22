package com.example.possystem.controller;

import com.example.possystem.domain.SalesOrder;
import com.example.possystem.dto.OrderRequestDTO;
import com.example.possystem.repository.SalesOrderRepository;
import com.example.possystem.service.SalesOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @PostMapping
    public SalesOrder createOrder(@RequestBody OrderRequestDTO orderRequest) {
        return salesOrderService.createOrder(orderRequest);
    }

    @GetMapping
    public List<SalesOrder> getAllOrders() {
        return salesOrderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getOrderById(@PathVariable Long id) {
        return salesOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
