import { useState } from 'react';
import './FilterModal.css';
import { TbFilterSearch } from "react-icons/tb";
import type { Filter } from '../../types/Filter';

interface FilterModalProps {
  filters: Filter;
  updateFilters: (priceEnabled?: boolean, minPrice?: number, maxPrice?: number, quantityEnabled?: boolean, minQuantity?: number, maxQuantity?: number) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ filters, updateFilters }) => {
  
  const logRender = () => {
    console.log('FilterModal rendered');
    return (
        <>
        </>
    )
  };
  return (
    
    <div className="filter-modal">
      <div className="filter-row">
        {logRender()}
        <label>
          <input 
            className="filter-checkbox"
            type="checkbox" 
            checked={filters.priceEnabled}
            onChange={() => updateFilters(!filters.priceEnabled)}
          />
          <span className="filter-label">Giá:</span>
        </label>
        <div className="filter-inputs">
          <input 
            type="number" 
            className="filter-input"
            value={filters.minPrice}
            onChange={(e) => updateFilters(filters.priceEnabled, Number(e.target.value), filters.maxPrice, filters.quantityEnabled, filters.minQuantity, filters.maxQuantity)}
            disabled={!filters.priceEnabled}
          />
          <span className="filter-to">-</span>
          <input 
            type="number" 
            className="filter-input"
            value={filters.maxPrice}
            onChange={(e) => updateFilters(filters.priceEnabled, filters.minPrice, Number(e.target.value), filters.quantityEnabled, filters.minQuantity, filters.maxQuantity)}
            disabled={!filters.priceEnabled}
          />
        </div>
      </div>
      
      <div className="filter-row">
        <label>
          <input 
            className="filter-checkbox"
            type="checkbox" 
            checked={filters.quantityEnabled}
            onChange={() => updateFilters(filters.priceEnabled, filters.minPrice, filters.maxPrice, !filters.quantityEnabled, filters.minQuantity, filters.maxQuantity)}
          />
          <span className="filter-label">Số lượng:</span>
        </label>
        <div className="filter-inputs">
          <input 
            type="number" 
            className="filter-input"
            value={filters.minQuantity}
            onChange={(e) => updateFilters(filters.priceEnabled, filters.minPrice, filters.maxPrice, filters.quantityEnabled, Number(e.target.value), filters.maxQuantity)}
            disabled={!filters.quantityEnabled}
          />
          <span className="filter-to">-</span>
          <input 
            type="number" 
            className="filter-input"
            value={filters.maxQuantity}
            onChange={(e) => updateFilters(filters.priceEnabled, filters.minPrice, filters.maxPrice, filters.quantityEnabled, filters.minQuantity, Number(e.target.value))}
            disabled={!filters.quantityEnabled}
          />
        </div>
      </div>
      
      
    </div>
  );
};

export default FilterModal;