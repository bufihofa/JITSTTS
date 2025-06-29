import { useEffect, useState } from "react";
import { getProductList } from "../../api/product";
import './Manage.css';
import ProductList from "../../component/product/ProductList";

const ProductManagePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const productList = await getProductList();
      console.log("Product list:", productList);
      setProducts(productList);
      setLoading(false);
    }
    loadProducts();
  }, []);
  
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(prev => 
      prev.length === products.length 
        ? [] 
        : products.map(product => product.id)
    );
  };
  
  return (
    <>
      <ProductList 
        products={products} 
        onDeleteProduct={(id: number) => {
          setProducts(products.filter(product => product.id !== id));
        }} 
        onEditProduct={(product: any) => {
          console.log("Edit product:", product);
        }}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
      />
    </>
  );
}

export default ProductManagePage;