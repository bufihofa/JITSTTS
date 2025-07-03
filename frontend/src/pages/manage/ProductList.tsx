import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, editProduct, searchProduct } from "../../api/product";
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
  

  //const [products, setProducts] = useState<any[]>([]);
  //const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  //const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  

  const [isFormOpen, setFormOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [editingProduct, setEdittingProduct] = useState<Product>();
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [shouldFetch, setShouldFetch] = useState(false);

  const [finalProducts, setFinalProducts] = useState<Product[]>([]);  
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasMore: false,
    hasPrevious: false,
  });

  
  // Pagination vs Search
  const [filters, setFilters] = useState<Filter>
  ({
    priceEnabled: false,
    minPrice: 0,
    maxPrice: 1000,
    quantityEnabled: false,
    minQuantity: 0,
    maxQuantity: 100
  });

  // Đổi params mỗi khi có thay đổi về filters or searchQuery
  const fetchProducts = async (page: number) => {
    const param: any = {};
    param.page = page;
    param.limit = pagination.limit || 10;
    param.searchTerm = searchQuery || '';
    if (filters.priceEnabled) {
      param.minPrice = filters.minPrice;
      param.maxPrice = filters.maxPrice;
    }
    if (filters.quantityEnabled) {
      param.minQuantity = filters.minQuantity;
      param.maxQuantity = filters.maxQuantity;
    }
    
    try {
      const temp = await searchProduct(param);
      
      setFinalProducts(temp.products);
      setPagination(temp.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchProducts(1);
    
  }, [filters, searchQuery]);
  
 
  useEffect(() => {
    if (shouldFetch) {
      fetchProducts(pagination.page);
      setShouldFetch(false);
    }
  }, [pagination.page]);
  
  const gotoPage = (page: number) =>{
    setShouldFetch(true);
    setPagination({
      ...pagination,
      page: page,
    });
      
  }
  

  



  
  
  
  // FILTER
  const onFilterButton = () => {
    setFilterOpen(!isFilterOpen);
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

  /*
  const handleSelectAll = () => {
    setSelectedProducts(prev => 
      prev.length === filteredProducts.length 
        ? [] : filteredProducts.map(product => product.id)
  )};
  */


  // DEL
  const handleDeleteProduct = async (id: number[]) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchProducts(pagination.page);
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
      if (productR) fetchProducts(pagination.page);
    }
    else {
      const productR = await createProduct([productTemp]);
      if (productR){
        if (isCopy) {
          
        }
        fetchProducts(pagination.page);
      }
    }
  }
    
  
  const handleCloseForm = () => {
    setEdittingProduct(undefined);
    setFormOpen(false);
  }
  
  

  const paginationControls = useMemo(() => {
    console.log("render pagination controls ",pagination);
    let startPage = Math.max(1, pagination.page - 2);
    let endPage = Math.min(pagination.totalPages, pagination.page + 2);
    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(5, pagination.totalPages);
      } else if (endPage === pagination.totalPages) {
        startPage = Math.max(1, pagination.totalPages - 4);
      }
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages.map(page => (
      <button 
        key={page}
        className={`page-button ${pagination.page === page ? 'active-page' : ''}`}
        disabled={pagination.page === page}
        onClick={() => gotoPage(page)}
      >
        {page}
      </button>
    ));
  }, [pagination, finalProducts]);

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
                  <input type="checkbox" className="select-all" />
                </th>
                <th>ID</th><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tag</th><th></th>
              </tr>
            </thead>

            <tbody>
              {finalProducts?.map((product) => (
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
            {finalProducts && finalProducts.length < pagination.limit && (
              Array.from({ length: pagination.limit - finalProducts.length }).map((_, index) => (
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
            {paginationControls}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;