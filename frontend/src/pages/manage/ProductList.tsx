import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, editProduct, getProductList } from "../../api/product";
import './Manage.css';
import { FaBoxArchive } from "react-icons/fa6";
import type { Product } from "../../types/Product";
import ProductForm from "../../component/product/ProductForm";
import { MdEdit, MdDelete } from "react-icons/md";
import { GoCopy } from "react-icons/go";
import SearchBar from "../../component/common/SearchBar";
import { TbFilterSearch } from "react-icons/tb";
import Button from "../../component/common/Button";
import FilterModal from "../../component/filter/FilterModal";
import type { Filter } from "../../types/Filter";





const ProductList: React.FC = () => {
  const [filters, setFilters] = useState<Filter>
  ({
    priceEnabled: false,
    minPrice: 0,
    maxPrice: 1000,
    quantityEnabled: false,
    minQuantity: 0,
    maxQuantity: 100
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [editingProduct, setEdittingProduct] = useState<Product>();
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    setCurrentPage(1); 
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tag?.toLowerCase().includes(searchQuery.toLowerCase())
    );  
  }, [products, searchQuery]);

  const currentProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
  }, [filteredProducts, currentPage, itemPerPage]);

  

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
  // FILTER
  const onFilterButton = () => {
    setFilterOpen(!isFilterOpen);
  }
  const handleApplyFilters = (newFilters: Filter) => {
    setFilters(newFilters);
    // You can also apply the filtering logic here
  }
  const updateFilters = (priceEnabled?: boolean, minPrice?: number, maxPrice?: number, quantityEnabled?: boolean, minQuantity?: number, maxQuantity?: number) => {
    setFilters(prev => ({
      ...prev,
      priceEnabled: priceEnabled ?? prev.priceEnabled,
      minPrice: minPrice ?? prev.minPrice,
      maxPrice: maxPrice ?? prev.maxPrice,
      quantityEnabled: quantityEnabled ?? prev.quantityEnabled,
      minQuantity: minQuantity ?? prev.minQuantity,
      maxQuantity: maxQuantity ?? prev.maxQuantity
    }));
  }
  // SELECT
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) : [...prev, productId]
  )};

  const handleSelectAll = () => {
    setSelectedProducts(prev => 
      prev.length === filteredProducts.length 
        ? [] : filteredProducts.map(product => product.id)
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
  const handleSave = async (product: any, isEdit = false, isCopy = false) => {
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
      if (productR){
        if (isCopy) {
          
        }
        setProducts([...products, ...productR]);
      }
    }
  }
    
  
  const handleCloseForm = () => {
    setEdittingProduct(undefined);
    setFormOpen(false);
  }
  
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemPerPage);
  }, [filteredProducts.length, itemPerPage]);

  const paginationControls = useMemo(() => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
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
            <div className="product-list-header-actions">
              <div className="temp">
              </div>

              <div className="product-list-header-button">
                
                <SearchBar
                  value={searchQuery}
                  onUpdateSearch={setSearchQuery}
                />
                <button className="header-button filter" onClick={() => onFilterButton()}><TbFilterSearch /></button>
                {isFilterOpen && 
                  (
                  <FilterModal
                    filters={filters}
                    updateFilters={updateFilters}
                  />
                  )
                }
                <Button
                  onAddButton={onAddButton}
                  text="Add Product"
                />
              </div>
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
                    <div className="product-list-actions">
                      <button className="button-copy-row" onClick={() => handleSave(product, false, true)}><GoCopy/></button>
                      <button className="button-edit-row" onClick={() => onEditButton(product)}><MdEdit/></button>
                      <button className="button-delete-row" onClick={() => handleDeleteProduct([product.id])}><MdDelete/></button>
                      
                    </div>
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
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
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