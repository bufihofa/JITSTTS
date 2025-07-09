import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import CMSInput from "../../component/common/Input";
import "./RoleManagement.css";
import { FaPlus, FaUsers, FaCog, FaKey, FaShieldAlt, FaSave } from "react-icons/fa";

interface Role {
  id: string;
  name: string;
  desc: string;
  perms?: any[];
}

interface Permission {
  id: string;
  name: string;
  action: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

const RoleList: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState<'config' | 'setrole'>('config');
  
  // State for roles
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // State for permissions
  const [permsList, setPermsList] = useState<Permission[]>([]);
  const [permName, setPermName] = useState("");
  const [permAction, setPermAction] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  
  // State for users
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);
  
  // State for feedback
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // Initial data load
  useEffect(() => {
    getRoles();
    getPerms();
    getUsers();
  }, []);

  // API functions
  const getRoles = async () => {
    try {
      const response = await axiosInstance.get('api/role/list');
      setRolesList(response.data.roles);
      return response.data;
    } catch (error) {
      showFeedback("Error fetching roles", "error");
      console.error("Error fetching roles:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get('api/user/list');
      setUsersList(response.data.users);
      return response.data;
    } catch (error) {
      showFeedback("Error fetching users", "error");
      console.error("Error fetching users:", error);
    }
  }

  const createRole = async () => {
    if (!roleName) {
      showFeedback("Role name is required", "error");
      return;
    }
    
    try {
      await axiosInstance.post('api/role/create', { name: roleName, desc: roleDesc });
      showFeedback(`Role "${roleName}" created successfully`, "success");
      setRoleName("");
      setRoleDesc("");
      getRoles();
    } catch (error) {
      showFeedback("Error creating role", "error");
      console.error("Error creating role:", error);
    }
  };

  const getPerms = async () => {
    try {
      const response = await axiosInstance.get('api/perm/list');
      setPermsList(response.data.perms);
      return response.data;
    } catch (error) {
      showFeedback("Error fetching permissions", "error");
      console.error("Error fetching permissions:", error);
    }
  };

  const createPerm = async () => {
    if (!permName || !permAction) {
      showFeedback("Permission name and action are required", "error");
      return;
    }
    
    try {
      await axiosInstance.post('api/perm/create', { name: permName, action: permAction });
      showFeedback(`Permission "${permName}" created successfully`, "success");
      setPermName("");
      setPermAction("");
      getPerms();
    } catch (error) {
      showFeedback("Error creating permission", "error");
      console.error("Error creating permission:", error);
    }
  }

  const updateRolePerms = async () => {
    if (!selectedRole) {
      showFeedback("No role selected", "error");
      return;
    }
    
    try {
      await axiosInstance.patch('api/role/update', { id: selectedRole, perms: selectedPerms });
      showFeedback("Role permissions updated successfully", "success");
      getRoles();
    } catch (error) {
      showFeedback("Error updating role permissions", "error");
      console.error("Error updating role permissions:", error);
    }
  }

  const setRole = async () => {
    if (!selectedUser || selectedUserRoles.length === 0) {
      showFeedback("User and at least one role must be selected", "error");
      return;
    }
    
    try {
      await axiosInstance.patch('api/role/setrole', { id: selectedUser, rolesList: selectedUserRoles });
      showFeedback("User roles updated successfully", "success");
      getUsers();
    } catch (error) {
      showFeedback("Error setting user roles", "error");
      console.error("Error setting user roles:", error);
    }
  }

  // Helper functions
  const showFeedback = (message: string, type: string) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleRoleSelect = (roleId: string) => {
    const role = rolesList.find(r => r.id === roleId);
    setSelectedRole(roleId);
    setSelectedPerms(role?.perms?.map(p => p.id) || []);
  };

  const handleUserSelect = (userId: string) => {
    const user = usersList.find(u => u.id === userId);
    setSelectedUser(userId);
    setSelectedUserRoles(user?.roles?.map(r => r.id) || []);
  };

  const togglePermission = (permId: string) => {
    setSelectedPerms(prev => 
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  const toggleUserRole = (roleId: string) => {
    setSelectedUserRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Render tab content
  const renderConfigTab = () => (
    <div className="role-config-container">
      <div className="role-section">
        <div className="section-header">
          <h3><FaShieldAlt /> Roles</h3>
          <div className="section-actions">
            <button 
              className="refresh-button" 
              onClick={getRoles}
              title="Refresh roles"
            >
              Refresh
            </button>
          </div>
        </div>
        
        <div className="create-form">
          <div className="form-row">
            <CMSInput
              label="Role Name"
              value={roleName}
              onChange={setRoleName}
              placeholder="Enter role name"
            />
            <CMSInput
              label="Description"
              value={roleDesc}
              onChange={setRoleDesc}
              placeholder="Enter role description"
            />
            <button className="create-button" onClick={createRole}>
              <FaPlus /> Create Role
            </button>
          </div>
        </div>

        <div className="items-list role-list">
          {rolesList?.map((role) => (
            <div 
              key={role.id} 
              className={`list-item ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="item-name">{role.name}</div>
              <div className="item-description">{role.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="permissions-section">
        <div className="section-header">
          <h3><FaKey /> Permissions</h3>
          <div className="section-actions">
            <button 
              className="refresh-button" 
              onClick={getPerms}
              title="Refresh permissions"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="create-form">
          <div className="form-row">
            <CMSInput
              label="Permission Name"
              value={permName}
              onChange={setPermName}
              placeholder="Enter permission name"
            />
            <CMSInput
              label="Action"
              value={permAction}
              onChange={setPermAction}
              placeholder="Enter permission action"
            />
            <button className="create-button" onClick={createPerm}>
              <FaPlus /> Create Permission
            </button>
          </div>
        </div>

        {selectedRole && (
          <div className="assign-permissions">
            <div className="assign-header">
              <h4>Assign permissions to: {rolesList.find(r => r.id === selectedRole)?.name}</h4>
              <button className="save-button" onClick={updateRolePerms}>
                <FaSave /> Save Permissions
              </button>
            </div>
            
            <div className="permissions-grid">
              {permsList?.map((perm) => (
                <div 
                  key={perm.id} 
                  className={`permission-item ${selectedPerms.includes(perm.id) ? 'selected' : ''}`}
                  onClick={() => togglePermission(perm.id)}
                >
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPerms.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                    />
                  </div>
                  <div className="permission-info">
                    <div className="permission-name">{perm.name}</div>
                    <div className="permission-action">{perm.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSetRoleTab = () => (
    <div className="set-role-container">
      <div className="users-section">
        <div className="section-header">
          <h3><FaUsers /> Users</h3>
          <div className="section-actions">
            <button 
              className="refresh-button" 
              onClick={getUsers}
              title="Refresh users"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="users-list">
          {usersList.map((user) => (
            <div 
              key={user.id} 
              className={`user-item ${selectedUser === user.id ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user.id)}
            >
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <div className="user-roles">
                {user.roles && user.roles.length > 0 ? 
                  user.roles.map(role => role.name).join(', ') : 
                  "No roles assigned"
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="assign-roles">
          <div className="assign-header">
            <h4>Assign roles to: {usersList.find(u => u.id === selectedUser)?.username}</h4>
            <button className="save-button" onClick={setRole}>
              <FaSave /> Save User Roles
            </button>
          </div>
          
          <div className="roles-grid">
            {rolesList?.map((role) => (
              <div 
                key={role.id} 
                className={`role-item ${selectedUserRoles.includes(role.id) ? 'selected' : ''}`}
                onClick={() => toggleUserRole(role.id)}
              >
                <div className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUserRoles.includes(role.id)}
                    onChange={() => toggleUserRole(role.id)}
                  />
                </div>
                <div className="role-info">
                  <div className="role-name">{role.name}</div>
                  <div className="role-description">{role.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="role-management">
      {feedback.message && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      <div className="role-tabs">
        <button 
          className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <FaCog /> Configuration
        </button>
        <button 
          className={`tab-button ${activeTab === 'setrole' ? 'active' : ''}`}
          onClick={() => setActiveTab('setrole')}
        >
          <FaUsers /> Assign Roles
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'config' ? renderConfigTab() : renderSetRoleTab()}
      </div>
    </div>
  );
};

export default RoleList;