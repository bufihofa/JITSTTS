import { useEffect, useState } from 'react';
import { axiosInstance } from '../../api/axiosInstance';
import './DashBoard.css';
import { FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";


interface LowStockProduct {
  id: number;
  name: string;
  quantity: number;
}

interface Activity {
  type: string;
  content: string;
  createdAt: string;
  detail: any;
}

const DashBoard = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
        
      }
    };

    fetchDashboardData();
  }, []);

  
  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
            <p className="card-title">Sản phẩm sắp hết hàng</p>
          </div>
          <div className="card-content">
            {lowStockProducts.length === 0 ? (
              <div className="empty-message">Không có sản phẩm nào sắp hết hàng</div>
            ) : (
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={index} className={product.quantity <= 5 ? "critical-stock" : ""}>
                      <td>{product.id}</td>
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
            <p className="card-title">Hoạt động gần đây</p>
          </div>
          <div className="card-content">
            {activities.length === 0 ? (
              <div className="empty-message">Không có hoạt động nào gần đây</div>
            ) : (
              <div className="activity-list">
                {activities.slice(0, 20).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon-container">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-details">
                      <div className="activity-content">{activity.content}</div>
                      <div className="activity-time">{formatDate(activity.createdAt)}</div>
                    </div>
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