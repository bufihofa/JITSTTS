import type { Product } from '../../types/Product';
import './ProductList.css'; 

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDeleteProduct, onEditProduct }) => {

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <button onClick={() => onEditProduct(product)}>Edit</button>
                <button onClick={() => onDeleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;