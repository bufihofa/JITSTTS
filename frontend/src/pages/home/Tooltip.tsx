import React from 'react';
import './Tooltip.css';
import type { Product } from '../../types/Product';

interface TooltipProps {
  activity: {
    type: string;
    detail?: Product[];
    oldDetail?: Product[];
  };
}

const Tooltip: React.FC<TooltipProps> = ({ activity }) => {
  const renderProductList = (products: Product[], title: string) => (
    <div className="tooltip-section">
      <h4 className="tooltip-title">{title}</h4>
      <div className="tooltip-products">
        {products.map((product, index) => (
          <div key={index} className="tooltip-product">
            <span className="product-name">{product.name}</span>
            <span className="product-details">
              ID: {product.id} | Giá: {product.price?.toLocaleString('vi-VN')}₫ | SL: {product.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tooltip">
      {activity.type === 'update' && activity.oldDetail && activity.oldDetail.length > 0 && (
        renderProductList(activity.oldDetail, 'Sản phẩm trước update:')
      )}
      {activity.detail && activity.detail.length > 0 && (
        renderProductList(activity.detail, 
          activity.type === 'update' ? 'Sản phẩm sau update:' : 'Chi tiết sản phẩm:'
        )
      )}
      
      
    </div>
  );
};

export default Tooltip;