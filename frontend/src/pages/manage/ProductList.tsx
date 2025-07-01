import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, editProduct, getProductList } from "../../api/product";
import './Manage.css';
import { FaBoxArchive } from "react-icons/fa6";
import type { Product } from "../../types/Product";
import ProductForm from "../../component/product/ProductForm";
import { MdEdit, MdDelete } from "react-icons/md";
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const [isFormOpen, setFormOpen] = useState(false);

  const [editingProduct, setEdittingProduct] = useState<Product>();
  
  const currentProducts = useMemo(() => {
    return products.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
  }, [products, currentPage, itemPerPage]);

  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      console.log(loading);
      setItemPerPage(10);
      setProducts(await getProductList());
      setLoading(false);
    }
    loadProducts();
  }, []);

  



  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  }



  // SELECT
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



  // DEL
  const handleDeleteProduct = async (id: number[]) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => !id.includes(product.id)));
      setSelectedProducts(prev => prev.filter(productId => !id.includes(productId)));
    }
  }


  // ADD & EDIT
  const onAddButton = () => {
    setEdittingProduct(undefined);
    setFormOpen(true);
  }
  const onEditButton = (product: any) => {
    setEdittingProduct(product);
    setFormOpen(true);
  }
  const handleSave = async (product: any, isEdit = false) => {
    setFormOpen(false);
    const productTemp: Product = 
      {
        id: product.id, 
        name: product.name, 
        price: Number(product.price) || 0, 
        quantity: Number(product.quantity) || 0, 
        tag: product.tag 
      }
    if (isEdit) {
      const productR = await editProduct([productTemp]);
      if (productR) setProducts(prev => prev.map(p => p.id === productTemp.id ? productTemp : p));
    }
    else {
      const productR = await createProduct([productTemp]);
      if (productR) setProducts([...products, ...productR]);
    }
  }
    
  
  const handleCloseForm = () => {
    setEdittingProduct(undefined);
    setFormOpen(false);
  }
  
  const totalPages = useMemo(() => {
    console.log("products.length", products.length, "itemPerPage", itemPerPage);
    return Math.ceil(products.length / itemPerPage);
  }, [products.length, itemPerPage]);

  const paginationControls = useMemo(() => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    console.log("totalPages", totalPages, "currentPage", currentPage, "startPage", startPage, "endPage", endPage);
    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages.map(page => (
      <button 
        key={page}
        className={`page-button ${currentPage === page ? 'active-page' : ''}`}
        disabled={currentPage === page}
        onClick={() => goToPage(page)}
      >
        {page}
      </button>
    ));
  }, [currentPage, totalPages]);

  return (
    <>
      {isFormOpen &&
        (
          <ProductForm
            onSave={handleSave}
            onCloseForm={handleCloseForm}
            editingProduct={editingProduct}
          />
        )
      }
      <div className="product-list">
        <div className="product-list-header">
          <FaBoxArchive className ="product-list-icon"/> 
          <div className="product-list-title">Storage</div> 
          <div className="product-list-actions">
            <button className="button-add" onClick={() => onAddButton()}>Add Item</button>
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
                <th>ID</th><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tag</th><th></th>
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
                    <button className="button-edit-row" onClick={() => onEditButton(product)}><MdEdit/></button>
                    <button className="button-delete-row" onClick={() => handleDeleteProduct([product.id])}><MdDelete/></button>
                  </td>
                </tr>
              ))}
            {currentProducts && currentProducts.length < itemPerPage && (
              Array.from({ length: itemPerPage - currentProducts.length }).map((_, index) => (
                <tr key={`${index}`} className="empty-row">
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
            <button className="page-button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>❮</button>
            {paginationControls}
            <button className="page-button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>❯</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;