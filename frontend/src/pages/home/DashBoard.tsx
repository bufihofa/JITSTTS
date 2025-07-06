import { useEffect, useState } from 'react';
import { axiosInstance } from '../../api/axiosInstance';
import './DashBoard.css';
import { FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import type { Product } from '../../types/Product';


interface LowStockProduct {
  id: number;
  name: string;
  quantity: number;
}

interface Activity {
  type: string;
  content: string;
  createdAt: string;
  detail?: Product[];
  oldDetail?: Product[];
}

const DashBoard = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hoveredActivity, setHoveredActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/api/product/data');
        if (response.data) {
          setLowStockProducts(response.data.lowStockProducts);
          setActivities(response.data.activities);
          
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        
      }
    };

    fetchDashboardData();
  }, []);

  
  

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
        return "mới đây";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
};

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'create':
        return <MdAdd className="activity-icon create" />;
      case 'delete':
        return <MdDelete className="activity-icon delete" />;
      case 'update':
        return <MdEdit className="activity-icon update" />;
      default:
        return <FaHistory className="activity-icon" />;
    }
  };

  return (
    <div className="dashboard-container">
        <div className="dashboard-card low-stock-container">
          <div className="card-header">
            <FaExclamationTriangle className="card-icon warning" />
            <p className="card-title">Low in stock</p>
          </div>
          <div className="card-content">
            {(
              <table className="low-stock-table">
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={index} className={product.quantity <= 0 ? "row critical-stock" : "row"}>
                      <td>{product.name}</td>
                      <td className="quantity-cell">{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-card activity-container">
          <div className="card-header">
            <FaHistory className="card-icon" />
            <p className="card-title">Recent activity</p>
          </div>
          <div className="card-content">
            {(
              <div className="activity-list">
                {activities.slice(0, 20).map((activity, index) => (
                  <div 
                    key={index} 
                    className="activity-item"
                    onMouseEnter={() => setHoveredActivity(activity)}
                    onMouseLeave={() => setHoveredActivity(null)}
                  >
                    <div className="activity-icon-container">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-details">
                      <div className="activity-content">{activity.content}</div>
                      <div className="activity-time">{formatDate(activity.createdAt)}</div>
                    </div>
                    
                    {hoveredActivity === activity && (activity.detail?.length || activity.oldDetail?.length) && (
                      <>
                       
                      </>
                      //<Tooltip activity={activity} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default DashBoard;