import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming these interfaces match the backend response
interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

interface OrderItem {
  id: number;
  product: Product;
  price: number; // Price at the time of order
}

interface SalesOrder {
  id: number;
  orderDate: string;
  orderItems: OrderItem[];
  totalPrice: number;
}

const SalesHistory: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2>판매 내역</h2>
      <div className="accordion" id="salesHistoryAccordion">
        {orders.map((order, index) => (
          <div className="accordion-item" key={order.id}>
            <h2 className="accordion-header" id={`heading${order.id}`}>
              <button
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse${order.id}`} 
                aria-expanded="false" 
                aria-controls={`collapse${order.id}`}>
                <strong>주문 #{order.id}</strong> - {new Date(order.orderDate).toLocaleString()} - 총 {order.totalPrice.toLocaleString()}원
              </button>
            </h2>
            <div 
              id={`collapse${order.id}`} 
              className="accordion-collapse collapse" 
              aria-labelledby={`heading${order.id}`} 
              data-bs-parent="#salesHistoryAccordion">
              <div className="accordion-body">
                <h5>주문 상세 내역</h5>
                <ul className="list-group">
                  {order.orderItems.map(item => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {item.product.name}
                      <span>{item.price.toLocaleString()}원</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesHistory;
