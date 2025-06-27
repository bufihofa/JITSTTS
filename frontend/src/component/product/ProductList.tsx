import type { Product } from '../../types/Product';
import './ProductList.css'; 

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDeleteProduct, onEditProduct }) => {
  //return;
  return (
    <div className="product-list">
      <div>
        button
      </div>
      <div className="product-table">
        <table className="product-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Tag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;