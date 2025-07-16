import { IoSettingsSharp } from "react-icons/io5";
import CMSInput from "../../component/common/Input";
import type { ButtonConfig } from "../../types/PageConfig";
import Button from "../../component/common/Button";
import { MdAdd, MdCall, MdCopyAll, MdDelete, MdEdit } from "react-icons/md";


interface TabButtonProps {
    mainButton: ButtonConfig;
    tableButtons?: ButtonConfig[];
    setMainButton: (button: ButtonConfig) => void;
    setTableButtons: (buttons: ButtonConfig[]) => void;

    saveChangesButtons: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({mainButton, tableButtons, setMainButton, setTableButtons, saveChangesButtons}) =>{
    
    const createNewButton = () => {
        const newButton: ButtonConfig = {
            icon: '',
            isShow: true
        };
        setTableButtons([...(tableButtons || []), newButton]);
    }
    
    const renderMainButtonConfig = () => {
        return (
            <div className="role-item table-config">
                <div className="role-header">
                    <div className="role-header-container">
                        <IoSettingsSharp className="role-icon" />
                        <p className="role-title">Config Main Button</p>
                        <div className="role-header-button">
                            <Button 
                            onAddButton={saveChangesButtons}
                            text="Save All Button"
                            />
                        </div>
                    </div>
                    
                </div>

                <div className="role-content config-table">
                    
                    <div className="config-table-sort">
                        <div className="config-table-sort-column">
                            <CMSInput
                                label="label"
                                value={mainButton.label}
                                onChange={(value) => {
                                    setMainButton({ ...mainButton, label: value });
                                }}
                            />
                        </div>
                        <div className="config-table-sort-column">
                            <CMSInput
                            label="permission"
                            value={mainButton.permission}
                            onChange={(value) => {
                                setMainButton({ ...mainButton, permission: value });
                            }}
                        />
                        </div>
                    </div>
                    

                    <div className="config-table-sort-column">
                        <CMSInput
                            label="open form"
                            value={mainButton.openForm || ''}
                            onChange={(value) => {
                                setMainButton({ ...mainButton, openForm: value });
                            }}
                        />
                    </div>
                    
                </div>
            </div>
        )
    }

    const renderTableButtonConfig = () => {
        return (
            <div className="role-item table-config">
                <div className="role-header">
                    <div className="role-header-container">
                        <IoSettingsSharp className="role-icon" />
                        <p className="role-title">Config Table Button</p>
                        <div className="role-header-button">
                            <Button 
                            onAddButton={createNewButton}
                            text="Add Button"
                            />
                        </div>
                    </div>
                    
                </div>
                    <div className="role-content config-table">
                    {tableButtons && tableButtons.map((button, index) => (
                        <div key={`button-${index}`} className="config-form-field-column">
                            <div className="config-table-delete-column">
                            <button 
                                className="config-table-delete-button"
                                onClick={() => {
                                    const newButtons = [...tableButtons];
                                    newButtons.splice(index, 1);
                                    setTableButtons(newButtons);
                                }}
                            >
                                <MdDelete /> 
                                
                            </button>
                            <p>Button - {button.icon}</p>
                            </div>
                            <div className="config-table-sort">
                                <div className="config-table-sort-column">
                                    <CMSInput
                                        label="permission"
                                        value={button.permission}
                                        onChange={(value) => {
                                            const newButtons = [...tableButtons];
                                            newButtons[index] = { ...button, permission: value };
                                            setTableButtons(newButtons);
                                        }}
                                    />
                                </div>
                                <div className="config-table-sort-column">
                                    <span style={{ marginRight: 8 }}>icon:
                                        
                                        {button.icon === "edit" && <MdEdit />}
                                        {button.icon === "del" && <MdDelete />}
                                        {button.icon === "add" && <MdAdd />}
                                        {button.icon === "copy" && <MdCopyAll />}
                                        {button.icon === "call" && <MdCall />}
                                    </span>
                                    <select 
                                        value={button.icon || ''}
                                        onChange={(e) => {
                                            const newButtons = [...tableButtons];
                                            newButtons[index] = { ...button, icon: e.target.value };
                                            setTableButtons(newButtons);
                                        }}
                                    >
                                        <option value="">None</option>
                                        <option value="del">Delete</option>
                                        <option value="edit">Edit</option>
                                        <option value="add">Add</option>
                                        <option value="copy">Copy</option>
                                        <option value="call">Call</option>
                                    </select>
                                </div>
                            </div>
                            <div className="config-table-sort-column">
                                <CMSInput
                                    label="open form"
                                    value={button.openForm || ''}
                                    onChange={(value) => {
                                        const newButtons = [...tableButtons];
                                        newButtons[index] = { 
                                            ...button, 
                                            openForm: value,
                                            api: undefined 
                                        };
                                        setTableButtons(newButtons);
                                    }}
                                />
                            </div>
                            <div className="config-table-sort">
                                <div className="config-table-sort-column">
                                    <CMSInput
                                        label="API URL"
                                        value={button.api?.url || ''}
                                        onChange={(value) => {
                                            const newButtons = [...tableButtons];
                                            newButtons[index] = { 
                                                ...button, 
                                                openForm: undefined,
                                                api: {
                                                    ...button.api,
                                                    url: value
                                                }
                                            };
                                            setTableButtons(newButtons);
                                        }}
                                        placeholder="/api/..."
                                    />
                                </div>
                                <div className="config-table-sort-column">
                                    <CMSInput
                                        label="extends"
                                        value={button.api?.suffix || ''}
                                        onChange={(value) => {
                                            const newButtons = [...tableButtons];
                                            newButtons[index] = { 
                                                ...button, 
                                                api: {
                                                    ...button.api,
                                                    suffix: value
                                                }
                                            };
                                            setTableButtons(newButtons);
                                        }}
                                        placeholder="id"
                                    />
                                </div>
                                
                            </div>
                            <div className="config-table-sort-direction">
                                <select 
                                    value={button.api?.method || 'GET'}
                                    onChange={(e) => {
                                        const newButtons = [...tableButtons];
                                        newButtons[index] = { 
                                            ...button, 
                                            api: {
                                                ...button.api,
                                                method: e.target.value
                                            }
                                        };
                                        setTableButtons(newButtons);
                                    }}
                                >
                                    <option value={"GET"}>GET</option>
                                    <option value={"POST"}>POST</option>
                                    <option value={"PUT"}>PUT</option>
                                    <option value={"PATCH"}>PATCH</option>
                                    <option value={"DELETE"}>DELETE</option>
                                    
                                    </select>
                                    
                            </div>
                            <div className="config-form-init">
                                <input
                                    type="checkbox"
                                    checked={button.api?.refresh || false}
                                    onChange={(e) => {
                                        const newButtons = [...tableButtons];
                                        newButtons[index] = { 
                                            ...button, 
                                            api: {
                                                ...button.api,
                                                refresh: e.target.checked
                                            }
                                        };
                                        setTableButtons(newButtons);
                                    }}
                                    
                                /> 
                                Refresh table after call API
                            </div>
                        </div>
                    ))}
                    <Button 
                    onAddButton={createNewButton}
                    text="Add Button"
                    />
                </div>
            </div>
        )
    }
    const renderButtonConfig = () => {
        return(
            <div className="table-tab-container">       
                {renderMainButtonConfig()}
                {renderTableButtonConfig()}
            </div>
        )
    }
    return (
        <>
            {renderButtonConfig()}
        </>
    );
}

export default TabButton;