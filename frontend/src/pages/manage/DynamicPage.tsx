import {  useState } from "react";

import DynamicTable from "./DynamicTable";
import './DynamicPage.css';
import DynamicForm from "../../component/form/DynamicForm";
import type { FormConfig, PageConfig } from "../../types/PageConfig";
import { FaBoxArchive } from "react-icons/fa6";
import SearchBar from "../../component/common/SearchBar";
import Button from "../../component/common/Button";
import { TbFilterSearch } from "react-icons/tb";
import { DynamicAPI } from "./DynamicAPI";
import { useSetting } from "../../context/useSetting";

export const productPageConfig: PageConfig = {

    permission: "product.search", 
    pageTitle: "Product Management",
    pageIcon: "StorageIcon",

    table: {
        initialSortBy: "name",
        initialSortDirection: "asc",
        columns: [
            { key: "name", label: "Name", sortable: false, width: 55, type: "text", isShow: true },
            { key: "price", label: "Price", sortable: true, width: 12, type: "number", isShow: true },
            { key: "quantity", label: "Quantity", sortable: true, width: 12, type: "number", isShow: true },
            { key: "tag", label: "Tag", sortable: true, width: 25, type: "text", isShow: true }
        ],
        api: {
            method: "GET",
            url: "/api/product/search",
            params: {
                searchTerm: "string",
                sortBy: "string",
                sortDirection: "string",
                page: "number",
                limit: "number"
            }
        }
    },
    
    action: {
        mainButton: {
            permission: "product.create",
            label: "Add Product",
            isShow: true,
            openForm: "addProductForm",
            
        },
        tableButtons: [
            
            {
                permission: "product.update",
                icon: "edit",
                isShow: true,
                openForm: "editProductForm",
            },
            {
                permission: "product.delete",
                icon: "del",
                isShow: true,
                api: {
                    method: "DELETE",
                    url: "/api/product",
                    suffix: "id",
                    refresh: true 
                }
            }
        ]
    },
    form: [
        {
            key: "addProductForm",
            name: "Add Product",
            fields: [
                { key: "name", label: "Name", type: "text", required: true },
                { key: "price", label: "Price", type: "number", required: true, defaultValue: 0 },
                { key: "quantity", label: "Quantity", type: "number", required: true, defaultValue: 0 },
                { key: "tag", label: "Tag", type: "text" }
            ],
            api: {
                method: "POST",
                url: "/api/product",
                refresh: true 
            }
        },
        {
            key: "editProductForm",
            name: "Edit Product",
            initData: true,
            fields: [
                { key: "id", label: "ID", type: "text", disabled: true },
                { key: "name", label: "Name", type: "text", required: true },
                { key: "price", label: "Price", type: "number", defaultValue: 0 },
                { key: "quantity", label: "Quantity", type: "number", defaultValue: 0 },
                { key: "tag", label: "Tag", type: "text" },
            ],
            api: {
                method: "PATCH",
                url: "/api/product",
                suffix: "id",
                refresh: true 
            }
        }

    ]

}

interface DynamicPageProps {
    pageConfig?: PageConfig;
}
const DynamicPage: React.FC<DynamicPageProps> = ({pageConfig}) => {
  const { checkPerm } = useSetting();
  const [searchQuery, setSearchQuery] = useState("");
  const [config] = useState<PageConfig>(pageConfig || productPageConfig);

  const [formConfig, setFormConfig] = useState<FormConfig>();
  const [isFormOpen, setFormOpen] = useState(false);
  const [initData, setInitData] = useState<any>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const onButtonClicked = () => {
    const form = config.form.find(f => f.key === config.action.mainButton?.openForm);
    if (!form) {
    console.error(`Form with key ${config.action.mainButton?.openForm} not found`);
    return;
    }
    if (!form.initData) {
        setInitData(null);
    }
    setFormConfig(form);
    if(!isFormOpen) setFormOpen(true);
  }
  const onCloseForm = () => {
    console.log("onCloseForm");
    setFormOpen(false);
  }
  const onFormSubmit = async (formValues: Record<string, any>) => {
    console.log("Form submitted with values:", formValues);
    //duyệt qua từng giá trị trong formValues, nếu giá trị là "" thì xóa
    Object.keys(formValues).forEach(key => {
        if (formValues[key] === "") {
            delete formValues[key];
        }
    });
    console.log("formConfig ", formConfig);
    const api = formConfig?.api;
    if (!api) {
        console.error("API configuration is missing in the form config");
        return;
    }
    await DynamicAPI(
        api.method || "POST", 
        `${api.url}${api.suffix ? `/${formValues[api.suffix]}` : ''}`, 
        api.params, 
        formValues
    );
    if (api.refresh) {
        setRefreshKey(prev => prev + 1);
    }
   
  }
    console.log("DynamicPage render");
  return (
    checkPerm(config?.permission) &&(
    <div className="dynamic-page">
        {
            isFormOpen &&
            (
            <DynamicForm
                formConfig={formConfig}
                onCloseForm={onCloseForm}
                handleSubmit={async (formValues) => {
                    await onFormSubmit(formValues);
                    onCloseForm();
                }}
                initData={initData}
            />
            )
        }

        <div className="dynamic-header">
            <FaBoxArchive className ="dynamic-icon"/> 
            <div className="dynamic-title">{config.pageTitle}</div> 
            <div className="dynamic-header-actions">
                <div className="temp">
                
                </div>

                <div className="dynamic-header-button">
                
                <SearchBar
                    value={searchQuery}
                    onUpdateSearch={setSearchQuery}
                />
                <button className="header-button filter" onClick={() => {}}><TbFilterSearch /></button>
                
                {(checkPerm(config?.action.mainButton?.permission) &&
                <Button
                    onAddButton={onButtonClicked}
                    text={config?.action.mainButton?.label || "Button"}
                />)}
                </div>
            </div>
        </div>

        <DynamicTable
            pageConfig={config}
            searchQuery={searchQuery}
            setFormConfig={setFormConfig}
            setFormOpen={setFormOpen}
            setInitData={setInitData}
            refreshKey={refreshKey}
        />

    </div>)
  )
}

export default DynamicPage;