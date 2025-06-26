import { useState } from "react";

interface AddProductFormProps {
    onAddProduct: (name: string, price: number) => void;
}
const ProductForm: React.FC<AddProductFormProps> = ({onAddProduct}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) {
            alert("Không được để trống các trường.");
            return;
        }
        
        onAddProduct(name, parseFloat(price));
        
        setName('');
        setPrice('');
    }
    return (
        <div className="product-form">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Name: </label>
            <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div>
            <label>Price: </label>
            <input
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            </div>
            <button type="submit">Add Product</button>
        </form>
        </div>
  );
}

export default ProductForm;