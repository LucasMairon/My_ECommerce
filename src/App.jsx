import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.description && newProduct.category && newProduct.image) {
      setProducts([...products, newProduct]);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null
      });
      setShowForm(false);
    } else {
      alert('Por favor, preencha todos os campos obrigatórios e selecione uma imagem.');
    }
  };

  const handleBuyProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="app">
      <h1>My Ecommerce</h1>
      <div className="product-list">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Preço:</strong> R$ {product.price}</p>
            <p><strong>Categoria:</strong> {product.category}</p>
            <button className="buy-button" onClick={() => handleBuyProduct(index)}>Comprar</button>
          </div>
        ))}
        <div className="add-product-card" onClick={() => setShowForm(true)}>
          <span>+</span>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="product-form">
            <h2>Adicionar Novo Produto</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                name="name"
                placeholder="Nome do Produto"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Preço"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descrição"
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Categoria"
                value={newProduct.category}
                onChange={handleInputChange}
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <div className="form-buttons">
                <button type="submit">Adicionar Produto</button>
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