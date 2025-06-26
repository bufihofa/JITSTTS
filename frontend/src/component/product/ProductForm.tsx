import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";

interface AddProductFormProps {
    onAddProduct: (name: string, price: number) => void;
    onUpdateProduct: (updatedProduct: Product) => void;
    editingProduct?:{
        id: number;
        name: string;
        price: number;
    }
}
const ProductForm: React.FC<AddProductFormProps> = ({onAddProduct, onUpdateProduct, editingProduct}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setPrice(editingProduct.price.toString());
        } else {
            setName('');
            setPrice('');
        }
    }, [editingProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price) {
            alert("Không được để trống các trường.");
            return;
        }

        if (editingProduct) {
            onUpdateProduct({
                id: editingProduct.id,
                name,
                price: parseFloat(price),
            });
        } else {
            onAddProduct(name, parseFloat(price));
        }
        
    }
    return (
        <div className="product-form">
        <h2>{editingProduct? `Sửa sản phẩm` : `Thêm sản phẩm`}</h2>
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
            <button type="submit">Xác nhận</button>
        </form>
        </div>
  );
}

export default ProductForm;