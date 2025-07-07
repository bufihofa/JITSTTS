import { useState, useEffect } from "react";
import storage from "../utils/storage";
import { GiExitDoor } from "react-icons/gi";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);

  return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  }).format(date);
    
};
const handleLogout = () => {
  storage.clearLoginData();
  window.location.href = '/login'; 
}

const Header = () => {
  const [lastAccess, setLastAccess] = useState<string>(storage.getLastAccess() || new Date().toISOString());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setLastAccess(storage.getLastAccess() || new Date().toISOString());
    };

    window.addEventListener('storageAccessUpdated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storageAccessUpdated', handleStorageUpdate);
    };
  }, []);

  return (
    <div className="cms-header">
      <div className="header-container">
        <div className="last-time">
         {formatDate(lastAccess)}
        </div>

          <GiExitDoor className="logout-icon" onClick={handleLogout}/>
      </div>
    </div>
  )
}
export default Header;
