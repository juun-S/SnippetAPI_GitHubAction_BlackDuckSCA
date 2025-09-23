import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

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
  quantity: number; // Added quantity for display
}

interface SalesOrder {
  id: number;
  orderDate: string;
  orderItems: OrderItem[];
  totalPrice: number;
}

const SalesHistory: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [dailyOrders, setDailyOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    fetchDailyOrders(selectedDate);
  }, [selectedDate]);

  const fetchDailyOrders = async (date: string) => {
    try {
      const response = await axios.get(`/api/orders/daily/${date}`);
      setDailyOrders(response.data);
    } catch (error) {
      console.error(`Error fetching daily orders for ${date}:`, error);
      setDailyOrders([]); // Clear orders on error
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

  return (
    <div className="container mt-4">
      <div className="card p-3 mb-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth" // Start with month view
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay' // Allow switching views
          }}
          dateClick={handleDateClick}
          weekends={true}
          // You can add events here if you want to mark days with sales
          // events={[
          //   { title: 'Sales', date: '2025-09-23' }
          // ]}
        />
      </div>

      <h2>{selectedDate} 판매 내역</h2>
      {dailyOrders.length === 0 ? (
        <p>선택한 날짜에 판매 내역이 없습니다.</p>
      ) : (
        <div className="accordion" id="salesHistoryAccordion">
          {dailyOrders.map((order) => (
            <div className="accordion-item" key={order.id}>
              <h2 className="accordion-header" id={`heading${order.id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${order.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${order.id}`}>
                  <strong>주문 #{order.id}</strong> - {new Date(order.orderDate).toLocaleTimeString()} - 총 {order.totalPrice.toLocaleString()}원
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
                        {item.product.name} ({item.quantity}개)
                        <span>{item.price.toLocaleString()}원</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistory;