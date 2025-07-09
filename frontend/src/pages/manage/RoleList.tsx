import React from "react";
import { axiosInstance } from "../../api/axiosInstance";
import CMSInput from "../../component/common/Input";

const RoleList = () => {
    const [rolesList, setRolesList] = React.useState([]);
    const [roleName, setRoleName] = React.useState("");
    const [roleDesc, setRoleDesc] = React.useState("");
    const [permsList, setPermsList] = React.useState([]);
    const [permName, setPermName] = React.useState("");
    const [permAction, setPermAction] = React.useState("");

    const [selectedRole, setSelectedRole] = React.useState(null);
    const [selectedPerms, setSelectedPerms] = React.useState<any[]>([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [usersList, setUsersList] = React.useState([]);

    const getRoles = async () => {
        try {
            const response = await axiosInstance.get('api/role/list');
            console.log("Roles fetched:", response.data);
            setRolesList(response.data.roles);
            return response.data;
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    };
    const getUsers = async () => {
        try {
            const response = await axiosInstance.get('api/user/list');
            console.log("Users fetched:", response.data);
            setUsersList(response.data.users);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }
    const createRole = async (name: string, desc: string) => {
        if(!name){
            name = "New Role"
        }
        if(!desc){
            desc = "No description"
        }
        try {
            const response = await axiosInstance.post('api/role/create', {name, desc});
            console.log("Role created:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    };
    const createPerm = async (name: string, action: string) => {
        if(!name){
            name = "New Permission"
        }
        if(!action){
            action = "No action"
        }
        try {
            const response = await axiosInstance.post('api/perm/create', {name, action});
            console.log("Permission created:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating permission:", error);
            throw error;
        }
    }
    const getPerms = async () => {
        try {
            const response = await axiosInstance.get('api/perm/list');
            console.log("Roles fetched:", response.data);
            setPermsList(response.data.perms);
            return response.data;
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    };
    
    const updateRolePerms = async (id: string, perms: any[]) => {
        try {
            console.log({ id, perms });
            const response = await axiosInstance.patch('api/role/update', { id, perms });
            
            console.log("Role permissions updated:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating role permissions:", error);
            throw error;
        }
    }
    const setRole = async (id: any, rolesList: any[]) => {
        try {
            console.log(id);
            console.log(selectedUser);
            console.log({ id, rolesList });
            const response = await axiosInstance.patch('api/role/setrole', { id, rolesList });
            console.log("Role set for user:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error setting role for user:", error);
            throw error;
        }
    }
    return (
        <div>
            <CMSInput
                label="Role Name"
                value={roleName}
                onChange={setRoleName}
                placeholder="Enter role name"
            />
            <CMSInput
                label="Role Description"
                value={roleDesc}
                onChange={setRoleDesc}
                placeholder="Enter role description"
            />
            <button onClick={() => createRole(roleName, roleDesc)}>Create Role</button>
            
            <button onClick={getRoles}>Get Roles</button>
            <ul>
                {rolesList?.map((role: any, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={selectedRole === role.id}
                            onChange={() => {
                                if (selectedRole === role.id) {
                                    setSelectedRole(null);
                                    setSelectedPerms([]);
                                } else {
                                    setSelectedRole(role.id);
                                    setSelectedPerms(role.role.perms.map((p: any) => p.id) || []);
                                }
                            }}
                        />
                        <strong>{role.name}</strong>: {role.desc}
                    </li>
                ))}
            </ul>
            

            <CMSInput
                label="Perm Name"
                value={permName}
                onChange={setPermName}
                placeholder="Enter perm name"
            />
            <CMSInput
                label="Perm action"
                value={permAction}
                onChange={setPermAction}
                placeholder="Enter perm action"
            />
            <button onClick={() => createPerm(permName, permAction)}>Create Perm</button>
            
            <button onClick={getPerms}>Get Perms</button>
            <ul>
                {permsList?.map((perm: any, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={selectedPerms?.includes(perm.id)}
                            onChange={() => {
                                if (selectedPerms?.includes(perm.id)) {
                                    setSelectedPerms(selectedPerms.filter((id: any) => id !== perm.id));
                                }
                                else {
                                    setSelectedPerms([...selectedPerms, perm.id]);
                                }
                            }}
                        />
                        
                        <strong>{perm.name}</strong>: {perm.action}
                    </li>
                ))}
            </ul>

            {(selectedRole && selectedPerms.length > 0) && (
                <button onClick={() => updateRolePerms(selectedRole, selectedPerms)}>
                    ({true && (`${selectedPerms}`)})
                </button>
            )}


            <br/>
            <button onClick={getUsers}>Get Users</button>
            <ul>
                {usersList?.map((user: any, index: number) => (
                    <li key={index}>
                        <input
                            type="radio"
                            checked={selectedUser === user.id}
                            onChange={() => setSelectedUser(user.id)}
                        />
                        <strong>{user.username}</strong>: {user.email} - {user.roles[0]?.name || "No role"}
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => selectedUser && selectedRole && setRole(selectedUser, [selectedRole])}
                disabled={!selectedUser || !selectedRole}
            >
                Set Role
            </button>
        </div>
    );
}
export default RoleList;