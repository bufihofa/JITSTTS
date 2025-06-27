import { useEffect, useState } from "react";
import { getProductList } from "../../api/product";
import './Manage.css';
import ProductList from "../../component/product/ProductList";
const ProductManagePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
  
  return (
    <>
      <div className="page-header">
        <p>Product Management</p>
        {loading && <p>Loading products...</p>}
      </div>
      <ProductList 

        products={products} 
        onDeleteProduct={(id: number) => {
          setProducts(products.filter(product => product.id !== id));
        }} 
        onEditProduct={(product: any) => {
          console.log("Edit product:", product);
        }}
      />
    </>
  );
}
export default ProductManagePage;