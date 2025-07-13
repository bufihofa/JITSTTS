import React, { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import CMSInput from "../../component/common/Input";
import "./RoleList.css";
import { MdEdit, MdDelete } from "react-icons/md";

import { FaPlus, FaUsers, FaCog, FaKey, FaShieldAlt, FaSave, FaExclamationTriangle } from "react-icons/fa";
import Button from "../../component/common/Button";

interface Role {
  id: string;
  name: string;
  desc: string;
  perms?: any[];
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}


const UserList: React.FC = () => {
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('api/user/list');
      console.log(response.data.users)
      setUsersList(response.data.users);
      return response.data;
    } catch (error) {
      
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
      fetchUsers();
    }, []);
  const userTab = useMemo(() => {
    return (
      <div className="role-item">
        <div className="role-header">
          <div className="role-header-container">
            <FaUsers className="role-icon" />
            <p className="role-title">Users</p>
            
          </div>
          
        </div>
        <div className="role-content">
          <div className="role-list">
    
            
          </div>
        </div>
      </div>
    );
  },[]);
  return (
    <div className="role-container">
        {userTab}
      
    </div>
  );
};

export default UserList;