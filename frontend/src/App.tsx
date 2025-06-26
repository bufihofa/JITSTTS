import { useState } from 'react';
import './App.css';
import Header from './component/header/Header';
import ProductList from './component/product/ProductList';
import Sidebar from './component/sidebar/Sidebar';
import ProductForm from './component/product/ProductForm';
import type { Product } from './types/Product';



const App = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'iPhone 15 Pro', price: 1200 },
    { id: 2, name: 'Samsung Galaxy S24', price: 1100 },
    { id: 3, name: 'Google Pixel 8', price: 900 },
  ]);
  const [editingProduct, setEditingProduct] = useState<Product>();


  const handleAddProduct = (name: string, price: number) => {
    const newProduct: Product = {
      id: Date.now(), 
      name,
      price,
    };
    setProducts([...products, newProduct]);
  };
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    if (editingProduct && editingProduct.id === id) {
      setEditingProduct(undefined);
    }
  };
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setEditingProduct(undefined);
  };
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          <ProductForm 
            onAddProduct={handleAddProduct} 
            onUpdateProduct={handleUpdateProduct}
            editingProduct={editingProduct}
            
          />
          <ProductList 
            products={products} 
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={(product) => setEditingProduct(product)}
          />
        </main>
      </div>
    </div>
  );
}

export default App;