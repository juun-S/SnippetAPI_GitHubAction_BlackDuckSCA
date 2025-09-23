import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal component - using inline style for simplicity, can be moved to a separate file
const Modal: React.FC<{ show: boolean; onClose: () => void; children: React.ReactNode }> = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '500px',
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="btn btn-secondary mt-3" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};


interface Product {
  id?: number;
  name: string;
  price: number;
  barcode: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({ name: '', price: 0, barcode: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenModal = (product: Product | null) => {
    setCurrentProduct(product);
    setFormData(product || { name: '', price: 0, barcode: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        // Update
        await axios.put(`/api/products/${currentProduct.id}`, formData);
      } else {
        // Create
        await axios.post('/api/products', formData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div>
      <h2>상품 관리</h2>
      <button className="btn btn-primary mb-3" onClick={() => handleOpenModal(null)}>상품 추가</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>상품명</th>
            <th>가격</th>
            <th>바코드</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.barcode}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => handleOpenModal(product)}>수정</button>
                <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(product.id!)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit}>
          <h3>{currentProduct ? '상품 수정' : '상품 추가'}</h3>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">상품명</label>
            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">가격</label>
            <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="barcode" className="form-label">바코드</label>
            <input type="text" className="form-control" id="barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn btn-success">{currentProduct ? '수정하기' : '추가하기'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
