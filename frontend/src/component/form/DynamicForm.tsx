import { IoCloseCircleSharp } from "react-icons/io5";
import type { FormConfig, PageConfig } from "../../types/PageConfig";
import CMSInput from "../common/Input";
import React, { useEffect, useState } from "react";

import './DynamicForm.css';

interface DynamicFormProps {
    formConfig?: FormConfig;
    onCloseForm: () => void;
    handleSubmit: (values: Record<string, any>) => void;
    initData?: any;
}


const DynamicForm: React.FC<DynamicFormProps> = ({formConfig, onCloseForm, handleSubmit, initData}) => {
    const config = formConfig;
    const [formValues, setFormValues] = useState<Record<string,any>>({});

    const onChange = (key: string, value: any) => {
        setFormValues(prev => ({ ...prev, [key]: value }));
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(formValues);
    };
    useEffect(() => {
        if (config?.initData) {
            setFormValues(initData);
        } else {
            const initialValues: Record<string, any> = {};
            config?.fields.forEach(field => {
                initialValues[field.key] = field.defaultValue || "";
            });
            setFormValues(initialValues);
        }
        console.log("form config ",config);
        console.log("form initData ",initData);
    },[initData]);
    return (
        <div className="dynamic-form-container">
            <div className="dynamic-form">
                <div className="dynamic-form-header">
                    
                    <h3 className="dynamic-form-header-text">{config?.name || `Dynamic Form`}</h3>
                    <IoCloseCircleSharp className="close-button" onClick={onCloseForm}/>

                    <p className="dynamic-form-header-id"></p>
                </div>
                
                <form className="dynamic-form-body" onSubmit={onFormSubmit}>
                    {
                    config?.fields.map(field => (
                        <CMSInput
                            key={field?.key}
                            label={field?.label}
                            placeholder={field?.label}
                            value={formValues[field?.key]}
                            type={field?.type}
                            disabled={field?.disabled}
                            onChange={val => onChange(field?.key, val)}
                        />
                    ))}
                    <button className="submit-btn" type="submit">Xác nhận</button>
                </form>
            </div>
        </div>
    );
};

export default DynamicForm;