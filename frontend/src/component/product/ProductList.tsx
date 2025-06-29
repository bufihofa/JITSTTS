import { FaBoxArchive } from 'react-icons/fa6';
import type { Product } from '../../types/Product';
import './ProductList.css'; 
import { useEffect, useState } from 'react';

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
  selectedProducts?: number[];
  onSelectProduct?: (productId: number) => void;
  onSelectAll?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDeleteProduct, onEditProduct, selectedProducts = [], onSelectProduct, onSelectAll }) => {
  const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(15);
  const [currentProducts, setCurrentProducts] = useState<Product[] | null>();
  const goToPage = (page: number) => {
    if (page < 1 || page > Math.ceil(products.length / itemPerPage)) return;
    setCurrentPage(page);
    setCurrentProducts(products.slice((page - 1) * itemPerPage, page * itemPerPage));
  }
  useEffect(() => {
    if (products.length > 0) {
      goToPage(currentPage);

    }
  }, [products, currentPage, itemPerPage]);

  return (
    <div className="product-list">
      <div className="product-list-header">
        <FaBoxArchive className ="product-list-icon"/> 
        <div className="product-list-title">Storage</div> 
        
      </div>
      <div className="product-table">
        <table className="product-list-table">
          <thead>
            <tr>
              <th className="select-all-header">
                <input 
                  type="checkbox" 
                  className="select-all"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Tag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((product) => (
              <tr key={product.id} className={`${selectedProducts.includes(product.id) ? 'selected-row row' : 'row'}`}>
                <td>
                  <input 
                    type="checkbox" 
                    className="select"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelectProduct?.(product.id)}
                  />
                </td>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.quantity || 0}</td>
                <td>{product.tag || 'N/A'}</td>
                <td>
                  <button className="button-edit" onClick={() => onEditProduct(product)}>Ed</button>
                  <button className="button-delete" onClick={() => onDeleteProduct(product.id)}>De</button>
                </td>
              </tr>
            ))}
          {currentProducts && currentProducts.length < itemPerPage && (
            Array.from({ length: itemPerPage - currentProducts.length }).map((_, index) => (
              <tr key={`empty-${index}`} className="row empty-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )))
          }
          </tbody>
        </table>
      </div>
      <div className="product-list-footer">
        <div className="footer-text">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / itemPerPage)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;