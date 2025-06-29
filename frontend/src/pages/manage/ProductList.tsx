import { useEffect, useState } from "react";
import { deleteProduct, getProductList } from "../../api/product";
import './Manage.css';
import { FaBoxArchive } from "react-icons/fa6";
import type { Product } from "../../types/Product";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentProducts, setCurrentProducts] = useState<Product[] | null>();
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setCurrentProducts(products.slice((page - 1) * itemPerPage, page * itemPerPage));
  }

  
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

  useEffect(() => {
      goToPage(currentPage);
  }, [products, currentPage, itemPerPage]);
  
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) : [...prev, productId]
  )};

  const handleSelectAll = () => {
    setSelectedProducts(prev => 
      prev.length === products.length 
        ? [] : products.map(product => product.id)
  )};

  const handleDeleteProduct = async (id: number[]) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => !id.includes(product.id)));
      setSelectedProducts(prev => prev.filter(productId => !id.includes(productId)));
    }
  }

  const handleEditProduct = (product: any) => {
    console.log("Edit product:", product);
  }

  
  return (
      <div className="product-list">
        <div className="product-list-header">
          <FaBoxArchive className ="product-list-icon"/> 
          <div className="product-list-title">Storage</div> 
          <div className="product-list-actions">
            <button className="button-delete" onClick={() => handleDeleteProduct(selectedProducts)}>Delete Selected</button>
          </div>
        </div>
        <div className="product-table">
          <table className="product-list-table">

            <thead>
              <tr>
                <th className="select-all-header">
                  <input type="checkbox" className="select-all" checked={isAllSelected} onChange={handleSelectAll} />
                </th>
                <th>ID</th><th>Product</th><th>Price</th><th>Quantity</th><th>Tag</th><th></th>
              </tr>
            </thead>

            <tbody>
              {currentProducts?.map((product) => (
                <tr key={product.id} className={`${selectedProducts.includes(product.id) ? 'selected-row row' : 'row'}`}>
                  <td>
                    <input type="checkbox" className="select" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct?.(product.id)} />
                  </td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity || 0}</td>
                  <td>{product.tag || 'N/A'}</td>
                  <td>
                    <button className="button-edit" onClick={() => handleEditProduct(product)}>Ed</button>
                    <button className="button-delete" onClick={() => handleDeleteProduct([product.id])}>De</button>
                  </td>
                </tr>
              ))}
            {currentProducts && currentProducts.length < itemPerPage && (
              Array.from({ length: itemPerPage - currentProducts.length }).map((_, index) => (
                <tr className="row empty-row">
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              )))
            }
            </tbody>

          </table>
        </div>
        <div className="product-list-footer">
          <div className="footer-text">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / itemPerPage)}>Next</button>
          </div>
        </div>
      </div>
    );
}

export default ProductList;