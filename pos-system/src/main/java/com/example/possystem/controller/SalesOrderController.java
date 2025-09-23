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

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrder> updateOrder(@PathVariable Long id, @RequestBody OrderRequestDTO orderRequest) {
        return salesOrderRepository.findById(id)
                .map(existingOrder -> {
                    // Assuming SalesOrderService has an update method that takes existing order and DTO
                    // Or, you can update fields directly here if the logic is simple
                    SalesOrder updatedOrder = salesOrderService.updateOrder(existingOrder, orderRequest);
                    return ResponseEntity.ok(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        salesOrderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
