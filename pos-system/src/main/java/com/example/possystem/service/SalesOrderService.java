package com.example.possystem.service;

import com.example.possystem.domain.OrderItem;
import com.example.possystem.domain.Product;
import com.example.possystem.domain.SalesOrder;
import com.example.possystem.dto.OrderRequestDTO;
import com.example.possystem.repository.ProductRepository;
import com.example.possystem.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SalesOrderService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Transactional
    public SalesOrder createOrder(OrderRequestDTO orderRequest) {
        SalesOrder salesOrder = new SalesOrder();
        salesOrder.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0;

        for (OrderRequestDTO.OrderItemDTO itemDto : orderRequest.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setSalesOrder(salesOrder);
            orderItems.add(orderItem);

            totalPrice += product.getPrice() * itemDto.getQuantity();
        }

        salesOrder.setOrderItems(orderItems);
        salesOrder.setTotalPrice(totalPrice);

        return salesOrderRepository.save(salesOrder);
    }
}
