import './ProductList.css'; 

const ProductList = () => {
  const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 1200 },
    { id: 2, name: 'Samsung Galaxy S24', price: 1100 },
    { id: 3, name: 'Google Pixel 8', price: 900 },
  ];

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;