import React, { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import "./RoleList.css";
import {  MdDelete } from "react-icons/md";

import {FaUsers, FaShieldAlt } from "react-icons/fa";
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

const User: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/api/role/list");
      setRoles(response.data.roles || []);

      
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('api/user/list');
        setUsersList(response.data.users);
        
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, []);

  const handleUserSelect = (userId: string) => {
    const user = usersList.find(u => u.id === userId);
    setSelectedUser(userId);
    setSelectedUserRoles(user?.roles?.map(r => r.id) || []);
  };
  const handleRoleSelect = (roleId: string) => {
    setSelectedUserRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };
  
  const setRole = async () => {

    try {
      await axiosInstance.patch('api/role/setrole', { id: selectedUser, rolesList: selectedUserRoles });
      fetchUser();
    } catch (error) {
      console.error("Error setting user roles:", error);
    }
  }

  const roleTab = useMemo(() => {
    return (
      <div className="role-item">
        <div className="role-header">
          <div className="role-header-container">
            <FaUsers className="role-icon" />
            <p className="role-title">User</p>
            <div className="role-header-button">
              
            </div>
          </div>
        </div>
        <div className="role-content">
          <div className="role-list">
    
            {usersList.map((user) => (
              <div key={user.id} className={`${selectedUser === user.id ? "selected" : ""} role-item-row`}>
                <input
                  type="radio"
                  name="selectedRole"
                  value={user.username}
                  checked={selectedUser === user.id}
                />
                <div className="role-item-info" onClick={() => handleUserSelect(user.id)}>
                    <p className="role-name">
                    
                    {user.username || "Unknown User"}
                    </p>
                  {user.roles.map((role) =>(
                    <p key={role.id} className="role-desc">{`${role.name}`}</p>
                  ))}
                </div>
                <button className="role-button-delete">
                  <MdDelete /> 
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },[usersList, selectedUser, selectedUserRoles]);
  const permTab = useMemo(() => {
    return (
      <div className="role-item">
        <div className="role-header">
          <div className="role-header-container">
            <FaShieldAlt className="role-icon" />
            <p className="role-title">Roles</p>
            <div className="role-header-button">
              
            </div>
          </div>
        </div>
        <div className="role-content">
          <div className="role-list">
            {roles.map((role) => (
              <div key={role.id} className={`${selectedUserRoles.includes(role.id) ? "selected" : ""} role-item-row perm-item-row ${!selectedUser ? "disabled" : ""}`}>
                <input
                  type="checkbox"
                  name="selectedRole"
                  disabled={!selectedUser}  
                  value={role.id}
                  checked={selectedUserRoles.includes(role.id)}
                />
                <div className={`role-item-info perm-item-info ${!selectedUser ? "disabled" : ""}`} onClick={() => {handleRoleSelect(role.id)}}>
                    <p className="role-name">
                    
                    {role.name}
                    </p>
                  {role.perms?.map((perm) =>(
                    <p key={perm.id} className="role-desc">{`${perm.name}`}</p>
                  ))}
                </div>
                <button className="role-button-delete">
                  <MdDelete /> 
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`role-save-button ${!selectedUser ? "disabled" : ""}`}>
          <Button 
            onAddButton={setRole}
            text="Save Changes"
          />
        </div>
      </div>
    );
  }, [roles, selectedUser, selectedUserRoles]);
  return (
    <div className="role-container">
      {roleTab}
      {permTab}
    </div>
  );
};

export default User;