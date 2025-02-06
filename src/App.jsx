import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrder, setNewOrder] = useState({
    name: '',
    price: '',
    quantity: '',
    is_payed: '',
    payment_form: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/orders/?search=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Pedidos recebidos:', data); // Log para depuração
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newOrder.name);
    formData.append('price', newOrder.price);
    formData.append('quantity', newOrder.quantity);
    formData.append('is_payed', newOrder.is_payed);
    formData.append('payment_form', newOrder.payment_form);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/orders/', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchOrders();
      setNewOrder({
        name: '',
        price: '',
        quantity: '',
        is_payed: '',
        payment_form: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
    }
  };

  const handleEditOrder = (order) => {
    setNewOrder(order);
    setCurrentOrderId(order.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newOrder.name);
    formData.append('price', newOrder.price);
    formData.append('quantity', newOrder.quantity);
    formData.append('is_payed', newOrder.is_payed);
    formData.append('payment_form', newOrder.payment_form);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/orders/${currentOrderId}/`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchOrders();
      setNewOrder({
        name: '',
        price: '',
        quantity: '',
        is_payed: '',
        payment_form: ''
      });
      setShowForm(false);
      setIsEditing(false);
      setCurrentOrderId(null);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/orders/${id}/`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchOrders();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="app">
      <h1>Meus Pedidos</h1>
      <input
        type="text"
        placeholder="Buscar pedidos..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>{order.name}</h3>
            <p><strong>Preço:</strong> R$ {order.price}</p>
            <p><strong>Quantidade:</strong> {order.quantity}</p>
            <p><strong>Forma de Pagamento:</strong> {order.payment_form}</p>
            <p><strong>Status de Pagamento:</strong> {order.is_payed}</p>
            <button className="edit-button" onClick={() => handleEditOrder(order)}>Editar</button>
            <button className="delete-button" onClick={() => handleDeleteOrder(order.id)}>Deletar</button>
          </div>
        ))}
        <div className="add-order-card" onClick={() => { setShowForm(true); setIsEditing(false); setNewOrder({ name: '', price: '', quantity: '', is_payed: '', payment_form: '' }); }}>
          <span>+</span>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="order-form">
            <h2>{isEditing ? 'Atualizar Pedido' : 'Adicionar Novo Pedido'}</h2>
            <form onSubmit={isEditing ? handleUpdateOrder : handleAddOrder}>
              <input
                type="text"
                name="name"
                placeholder="Nome do Pedido"
                value={newOrder.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Preço"
                value={newOrder.price}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantidade"
                value={newOrder.quantity}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="payment_form"
                placeholder="Forma de Pagamento"
                value={newOrder.payment_form}
                onChange={handleInputChange}
                required
              />
              <select
                name="is_payed"
                value={newOrder.is_payed}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o Status de Pagamento</option>
                <option value="Pago">Pago</option>
                <option value="A pagar">A Pagar</option>
              </select>
              <div className="form-buttons">
                <button type="submit">{isEditing ? 'Atualizar Pedido' : 'Adicionar Pedido'}</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;