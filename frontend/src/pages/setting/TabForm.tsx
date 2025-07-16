import { IoSettingsSharp } from "react-icons/io5";
import Button from "../../component/common/Button";
import CMSInput from "../../component/common/Input";
import { MdDelete } from "react-icons/md";
import type { FormConfig } from "../../types/PageConfig";
interface TabFormProps {
    forms: FormConfig[];
    setForms: (forms: FormConfig[]) => void;
    saveChangesForm: () => void;
}
const TabForm: React.FC<TabFormProps> = ({forms, saveChangesForm, setForms}) => {
    // PAGE TAB
    const createNewForm = () => {
        const newForm: FormConfig = {
            key: `form-${forms.length + 1}`,
            name: `Form ${forms.length + 1}`,
            fields: []
        };
        setForms([...forms, newForm]);
    }
    const renderFormEach = (form: FormConfig, index: number) => {
        return (
            <div className="role-item table-config">
                <div className="role-header ">
                    <div className="role-header-container">
                    <p className="role-title">Config Form - {form.name}</p>
                    
                    </div>

                </div>
                <div className="role-content config-table">
                    <div className="config-form-field-column">
                    <IoSettingsSharp className="role-icon" />
                    <div className="config-table-sort">
                        <div className="config-table-sort-column">
                            <CMSInput
                                label="Form Key"
                                value={form.key}
                                onChange={(value) => {
                                    const newForms = [...forms];
                                    newForms[index].key = value;
                                    setForms(newForms);
                                }}
                            />
                        </div>
                        <div className="config-table-sort-column">
                            <CMSInput
                                label="Form Name"
                                value={form.name}
                                onChange={(value) => {
                                    const newForms = [...forms];
                                    newForms[index].name = value;
                                    setForms(newForms);
                                }}
                            />
                        </div>
                    </div>
                    <div className="config-form-init">
                        <input
                            type="checkbox"
                            checked={form.initData}
                            onChange={(e) => {
                                const newForms = [...forms];
                                newForms[index].initData = e.target.checked;
                                setForms(newForms);
                            }}
                            
                        /> 
                        Initialize with existing data (for edit forms)
                    </div>
                    <div className="config-form-init">
                        <input
                            type="checkbox"
                            checked={form.api?.refresh}
                            onChange={(e) => {
                                const newForms = [...forms];
                                newForms[index].api = {
                                    ...newForms[index].api,
                                    refresh: e.target.checked
                                };
                                setForms(newForms);
                            }}
                            
                        /> 
                        Refresh table after submit
                    </div>
                    <div className="config-table-sort">
                        <div className="config-table-sort-column">
                            <CMSInput
                                label="API URL"
                                value={form.api?.url || ''}
                                onChange={(value) => {
                                    const newForms = [...forms];
                                    newForms[index].api = {
                                        ...newForms[index].api,
                                        url: value,
                                        method: newForms[index].api?.method || "GET"
                                    };
                                    setForms(newForms);
                                }}
                                placeholder="/api/product/search"
                            />
                        </div>
                        <div className="config-table-sort-column">
                            <CMSInput
                                label="extends"
                                value={form.api?.suffix || ''}
                                onChange={(value) => {
                                    const newForms = [...forms];
                                    newForms[index].api = {
                                        ...newForms[index].api,
                                        url: newForms[index].api?.url || '',
                                        method: newForms[index].api?.method || "GET",
                                        suffix: value
                                    };
                                    setForms(newForms);
                                }}
                                placeholder="id"
                            />
                        </div>
                        <div className="config-table-sort-direction">
                            <select 
                                value={form.api?.method || 'GET'}
                                onChange={(e) => {
                                    const newForms = [...forms];
                                    newForms[index].api = {
                                        ...newForms[index].api,
                                        url: newForms[index].api?.url || '',
                                        method: e.target.value
                                    };
                                    setForms(newForms);
                                }}
                            >
                                <option value={"GET"}>GET</option>
                                <option value={"POST"}>POST</option>
                                <option value={"PUT"}>PUT</option>
                                <option value={"PATCH"}>PATCH</option>
                                <option value={"DELETE"}>DELETE</option>
                                
                                </select>
                        </div>
                    </div>
                    </div>
                    {form.fields.map((field, index2) => (
                        <div className="config-form-field-column">
                            <div className="config-table-delete-column">
                                
                                <button 
                                    className="config-table-delete-button"
                                    onClick={() => {
                                        const newForms = [...forms];
                                        newForms[index].fields = newForms[index].fields.filter((_, i) => i !== index2);
                                        setForms(newForms);
                                    }}
                                >
                                    <MdDelete /> 
                                    
                                </button>
                                <p>Field - {field.label}</p>
                            </div>
                            
                            <div key={`${form.key}-${index2}`} className="config-form-field">
                                <div className="config-form-field-type">
                                    <CMSInput
                                        label={`key`}
                                        value={field.key}
                                        onChange={(value) => {
                                            const newForms = [...forms];
                                            newForms[index].fields[index2].key = value;
                                            setForms(newForms);
                                        }}
                                        placeholder="Enter field key"
                                    />
                                    <CMSInput
                                        label={`label`}
                                        value={field.label}
                                        onChange={(value) => {
                                            const newForms = [...forms];
                                            newForms[index].fields[index2].label = value;
                                            setForms(newForms);
                                        }}
                                        placeholder="Enter field label"
                                    />
                                </div>
                                <div className="config-form-field-type type-select">
                                    <CMSInput
                                        label={`type`}
                                        value={field.type}
                                        onChange={(value) => {
                                            const newForms = [...forms];
                                            newForms[index].fields[index2].type = value;
                                            setForms(newForms);
                                        }}
                                        placeholder="Enter field key"
                                    />
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => {
                                            const newForms = [...forms];
                                            newForms[index].fields[index2].required = e.target.checked;
                                            setForms(newForms);
                                        }}
                                        
                                    /> 
                                    <p>required?</p>

                                    <input
                                        type="checkbox"
                                        checked={field.disabled}
                                        onChange={(e) => {
                                            const newForms = [...forms];
                                            newForms[index].fields[index2].disabled = e.target.checked;
                                            setForms(newForms);
                                        }}
                                        
                                    /> 
                                    <p>disabled?</p>
                                </div>
                            </div>
                        </div>
                    ))}
                <div className="config-table-add-column">
                    <Button 
                        onAddButton={() => {
                            const newForms = [...forms];
                            newForms[index].fields.push({ 
                                key: `field-${newForms[index].fields.length + 1}`, 
                                label: `Field ${newForms[index].fields.length + 1}`,
                                type: 'text', 
                                required: false
                                
                            });
                            setForms(newForms);
                        }}
                        text="Add Field"
                    />
                </div>
                </div>
            </div>
        )
    }
    const renderFormConfig = () => {
        return (
            <div className="table-tab-container">
                <div className="role-item table-config">
                    <div className="role-header">
                        <div className="role-header-container">
                            <IoSettingsSharp className="role-icon" />
                            <p className="role-title">Config Form</p>
                            <div className="role-header-button">
                                <Button 
                                onAddButton={saveChangesForm}
                                text="Save All Form"
                                />
                            </div>
                        </div>
                        
                    </div>
                    <div className="role-content config-table">
                        All Form 
                        {forms.map((form, index) => (
                            <div key={index} className="config-form-column">
                                <pre>{JSON.stringify({ key: form.key, name: form.name }, null, 2)}</pre>
                            </div>
                        ))}
                        <Button 
                            onAddButton={createNewForm}
                            text="Create New Form"
                        />
                    </div>
                </div>
                {forms.map((form, index) => (
                    <div key={index}>
                        {renderFormEach(form, index)}
                    </div>
                ))}
            </div>
            );
    }
    return (
        <div>
            {renderFormConfig()}
        </div>
    );
}
export default TabForm;