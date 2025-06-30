import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import { IoCloseCircleSharp } from "react-icons/io5";import './ProductForm.css'
import CMSInput from "../common/Input";
import SelectTab from "../common/SelectTab";
interface AddProductFormProps {
    onAddProduct: (product: Product) => void;
    onEditProduct: (product: Product) => void;
    onCloseForm: () => void;
    editingProduct?:{
        id: number;
        name: string;
        price: number;
        tag: string;
        quantity: number;
    }
}
const ProductForm: React.FC<AddProductFormProps> = ({onAddProduct, onEditProduct, onCloseForm, editingProduct}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [tag, setTag] = useState('');
    const [isEdit, setEdit] = useState(!!editingProduct);

    const toggleEdit = (add: boolean) =>{
        setEdit(!add);
    }
    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setPrice(editingProduct.price);
            setQuantity(editingProduct.quantity);
            setTag(editingProduct.tag);

            setEdit(true);
        } else {
            setName('');
            setPrice(0);
            setQuantity(0);
            setTag('');
            
        }
    }, [editingProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            alert("Không được để trống tên SP.");
            return;
        }

        if (isEdit && editingProduct) {
            onEditProduct({
                id: editingProduct.id,
                name,
                price,
                quantity,
                tag
            });
        } else {
            onAddProduct({
                id: Date.now(), 
                name,
                price,
                quantity,
                tag
            });
        }
        
    }
    return (
        <div className="product-form-container">
            <div className="product-form">
                <div className="product-form-header" key={isEdit ? 'edit' : 'add'}>
                    
                    <h3 className="product-form-header-text">{isEdit ? `Sửa sản phẩm` : `Thêm sản phẩm`} </h3>
                    <IoCloseCircleSharp className="close-button" onClick={onCloseForm}/>

                    <p className="product-form-header-id">{isEdit ? `ID ${editingProduct?.id}` : `-`}</p>
                </div>
                <SelectTab
                    leftTab="Thêm"
                    rightTab="Sửa"
                    isLeft={!isEdit}
                    setLeft={toggleEdit}
                    disableRight={!editingProduct}
                />
                <form className="product-form-body" onSubmit={handleSubmit}>
                    <CMSInput 
                      label="Tên sản phẩm"
                      placeholder="Tên sản phẩm"
                      value={name}
                      onChange={setName}
                    />
                    <CMSInput 
                      label="Giá"
                      placeholder="Giá"
                      value={price}
                      type="number"
                      onChange={setPrice}
                    />
                    <CMSInput 
                      label="Số lượng"
                      placeholder="Số lượng"
                      value={quantity}
                      type="number"
                      onChange={setQuantity}
                    />
                    <CMSInput 
                      label="Tag"
                      placeholder="Tag"
                      value={tag}
                      onChange={setTag}
                    />
                    <button type="submit">Xác nhận</button>
                </form>
            </div>
        </div>
  );
}

export default ProductForm;