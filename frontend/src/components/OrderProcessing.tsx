import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

interface CartItem extends Product {
  quantity: number;
}

const OrderProcessing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Recalculate total whenever cart changes
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('카트가 비어있습니다.');
      return;
    }

    const orderRequest = {
      productIds: cart.flatMap(item => Array(item.quantity).fill(item.id))
    };

    try {
      await axios.post('/api/orders', orderRequest);
      alert('주문이 성공적으로 완료되었습니다.');
      setCart([]); // Clear cart
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="row">
      <div className="col-md-7">
        <h2>상품 목록</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.price.toLocaleString()}원</p>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary w-100" onClick={() => addToCart(product)}>카트에 추가</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-md-5">
        <h2>주문 내역 (카트)</h2>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {item.name} <br/>
                <small>{item.price.toLocaleString()}원</small>
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="form-control form-control-sm" 
                  style={{width: '60px'}}
                  min="0"
                />
              </div>
            </li>
          ))}
        </ul>
        <h3>총 주문 금액: {total.toLocaleString()}원</h3>
        <button className="btn btn-success w-100" onClick={handleSubmitOrder}>주문 완료</button>
      </div>
    </div>
  );
};

export default OrderProcessing;
