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

interface Permission {
  id: string;
  name: string;
  action: string;
}


const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [roleDesc, setRoleDesc] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [permsList, setPermsList] = useState<Permission[]>([]);
  const [permName, setPermName] = useState("");
  const [permAction, setPermAction] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  
  const isChanged = () => {
    if (!selectedRole) return false;
    
    const originalPerms = selectedRole.perms?.map(p => p.id) || [];
    const currentPerms = selectedPerms.sort();
    const sortedOriginalPerms = originalPerms.sort();
    console.log("render");
    return JSON.stringify(sortedOriginalPerms) !== JSON.stringify(currentPerms);
  }
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/api/role/list");
      console.log(response.data.roles);
      setRoles(response.data.roles || []);
      console.log("setrole");
      if(selectedRole) {
        const updatedSelectedRole = (response.data.roles || []).find((role: Role) => role.id === selectedRole.id);
        if (updatedSelectedRole) {
          handleRoleSelect(updatedSelectedRole);
        }
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchPermissions = async () => {
    try {
      const response = await axiosInstance.get("/api/perm/list");
      setPermsList((response.data.perms || []).sort((a: Permission, b: Permission) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleRoleSelect = (selected: Role) => {
    setSelectedRole(selected);
    setSelectedPerms(selected?.perms?.map(p => p.id) || []);
  };
  const handlePermSelect = (selected: Permission) => {
    setSelectedPerms(prev => {
      if (prev.includes(selected.id)) {
        return prev.filter(id => id !== selected.id);
      } else {
        return [...prev, selected.id];
      }
    });
  };
  
  const updateRolePerms = async () => {
    if (!selectedRole) return;
    try {
      const response = await axiosInstance.patch("/api/role/update", {
        id: selectedRole.id,
        perms: selectedPerms
      });
      if (response.status === 200) {
        console.log("Permissions updated successfully");
        fetchRoles();
        
      } else {
        console.error("Failed to update permissions:", response.data);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  }
  const createRole = async () => {
    if (!roleName) {
      alert("Không được để trống thông tin");
      return;
    }
    
    try {
      await axiosInstance.post('api/role/create', { name: roleName, desc: roleDesc });
      setRoleName("");
      setRoleDesc("");
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };
  const createPerm = async () => {
    if (!permName || !permAction) {
      alert("Không được để trống thông tin");
      return;
    }
    
    try {
      await axiosInstance.post('api/perm/create', { name: permName, action: permAction });
      setPermName("");
      setPermAction("");
      fetchPermissions();
    } catch (error) {
      console.error("Error creating permission:", error);
    }
  }
  const roleTab = useMemo(() => {
    return (
      <div className="role-item">
        <div className="role-header">
          <div className="role-header-container">
            <FaShieldAlt className="role-icon" />
            <p className="role-title">Roles</p>
            <div className="role-header-button">
              <Button 
                onAddButton={createRole}
                text="Add Role"
              />
            </div>
          </div>
          <div className="role-header-input">
            <CMSInput
                label="Name"
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
          </div>
        </div>
        <div className="role-content">
          <div className="role-list">
    
            {roles.map((role) => (
              <div key={role.id} className={`${selectedRole?.id === role.id ? "selected" : ""} role-item-row`}>
                <input
                  type="radio"
                  name="selectedRole"
                  value={role.id}
                  checked={selectedRole?.id === role.id}
                />
                <div className="role-item-info" onClick={() => handleRoleSelect(role)}>
                    <p className="role-name">
                    
                    {role.name}
                    </p>
                  <p className="role-desc">{`${role.desc}.`}</p>
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
  },[roleName, roleDesc, roles, selectedRole]);
  const permTab = useMemo(() => {
    return (
      <div className="role-item">
        <div className="role-header">
          <div className="role-header-container">
            <FaKey className="role-icon" />
            <p className="role-title">Permissions</p>
            <div className="role-header-button">
              <Button 
                onAddButton={createPerm}
                text="Add Permission"
              />
            </div>
          </div>
          <div className="role-header-input">
            <CMSInput
                label="Name"
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
          </div>
        </div>
        <div className="role-content">
          <div className="role-list">
            {permsList.map((perm) => (
              <div key={perm.id} className={`${selectedPerms.includes(perm.id) ? "selected" : ""} role-item-row perm-item-row ${!selectedRole ? "disabled" : ""}`}>
                <input
                  type="checkbox"
                  name="selectedRole"
                  disabled={!selectedRole}  
                  value={perm.id}
                  checked={selectedPerms.includes(perm.id)}
                />
                <div className={`role-item-info perm-item-info ${!selectedRole ? "disabled" : ""}`} onClick={() => {handlePermSelect(perm)}}>
                    <p className="role-name">
                    
                    {perm.name}
                    </p>
                  <p className="role-desc">{`${perm.action}`}</p>
                </div>
                <button className="role-button-delete">
                  <MdDelete /> 
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`role-save-button ${!selectedRole || !isChanged() ? "disabled" : ""}`}>
          <Button 
            onAddButton={updateRolePerms}
            text="Save Changes"
          />
        </div>
      </div>
    );
  }, [permName,permAction,permsList,selectedPerms]);
  return (
    <div className="role-container">
      {roleTab}
      {permTab}
    </div>
  );
};

export default RoleList;