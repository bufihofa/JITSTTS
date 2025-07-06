import { useEffect, useMemo, useRef, useState } from "react";
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
import Pagination from "../../component/pagination/Pagination";

import { LuArrowUpDown, LuArrowDown10, LuArrowUp01, LuArrowDownZA, LuArrowUpAZ } from "react-icons/lu";




const ProductList: React.FC = () => {
  

  //const [products, setProducts] = useState<any[]>([]);
  //const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  //const isAllSelected = selectedProducts.length === products.length && products.length > 0;
  

  const [isFormOpen, setFormOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [editingProduct, setEdittingProduct] = useState<Product>();
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const shouldFetch = useRef(true);
  
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
    maxPrice: 20000,
    quantityEnabled: false,
    minQuantity: 0,
    maxQuantity: 100
  });

  // Đổi params mỗi khi có thay đổi về filters or searchQuery
  const fetchProducts = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      page: page,
    }));
    const param: any = {};
    param.page = page;
    param.limit = pagination.limit || 10;
    param.searchTerm = searchQuery || '';
    param.sortBy = sortBy;
    param.sortDirection = sortDirection;

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
      if(temp.pagination.totalPages < pagination.page) {
          setPagination(prev => ({
          ...prev,
          page: temp.pagination.page,
          totalItems: temp.pagination.totalItems,
          totalPages: temp.pagination.totalPages,
        }));
      }
      else{
        setPagination(prev => ({
          ...prev,
          totalItems: temp.pagination.totalItems,
          totalPages: temp.pagination.totalPages,
        }));
      }
      
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      shouldFetch.current = true;
    }
  };
  useEffect(() => {
    shouldFetch.current = false;
    setPagination(prev => ({
        ...prev,
        page: 1,
    }));
    fetchProducts(1);
    
  }, [filters, searchQuery, sortBy, sortDirection, pagination.limit]);
  
 
  
  
  const gotoPage = (page: number) =>{
    if(!shouldFetch.current) {
      console.log("Fetching is in progress, please wait.");
      return;
    }
    shouldFetch.current = false;
    fetchProducts(page);
      
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

  
  
  


  // DEL
  const handleDeleteProduct = async (id: number[]) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setSelectedProducts([]);
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
  
  const handleSort = (by: string) => {
    if (sortBy === by) {
      if(sortDirection == 'asc'){
        setSortDirection('desc');
      }
      else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(by);
      setSortDirection('asc');
    }
  }
  const sortTH = (by: string, label: string) => {
    if(by === 'name' || by === 'tag' ) {
      return <th onClick={()=>{handleSort(by)}}>{label} {sortBy==by ? (sortDirection=="asc" ? <LuArrowUpAZ className="arrow"/> : <LuArrowDownZA className="arrow"/>) : <LuArrowUpDown className="arrow-unsort"/>}</th>
    }
    else {
      return <th onClick={()=>{handleSort(by)}}>{label} {sortBy==by ? (sortDirection=="asc" ? <LuArrowUp01 className="arrow"/> : <LuArrowDown10 className="arrow"/>) : <LuArrowUpDown className="arrow-unsort"/>}</th>
    }
  }
  const paginationControls = useMemo(() => {
    return(
      <Pagination
        pagination={pagination}
        gotoPage={gotoPage}
      />  
    )
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
                {selectedProducts.length > 0 && (
                  <button className="button-delete-row" onClick={() => handleDeleteProduct(selectedProducts)}><MdDelete/></button>
                )}
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
                </th>
                {sortTH("name", "Sản phẩm")}
                {sortTH("price", "Giá")}
                {sortTH("quantity", "SL")}
                {sortTH("tag", "Tag")}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {finalProducts?.map((product) => (
                <tr key={product.id} className={`${selectedProducts.includes(product.id) ? 'selected-row row' : 'row'}`}>
                  <td>
                    <input type="checkbox" className="select" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct?.(product.id)} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price?.toLocaleString('vi-VN')}₫</td>
                  <td>{product.quantity?.toLocaleString('vi-VN') || 0}</td>
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
            <div className="footer-text-info">
              Showing {Math.max(0,((pagination.page-1)*pagination.limit + 1))} - {Math.min(pagination.totalItems, pagination.page*pagination.limit)} of {pagination.totalItems} entries
            </div>
            <div className="footer-text-pagination">
             {paginationControls}
            </div>
            <div className="footer-text-select-limit">
              <span className="footer-text-select-label">Items per page: </span>
              <select 
                className="footer-text-select"
                value={pagination.limit}
                onChange={(e) => {
                  setPagination(prev => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1
                  }));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;