import { useEffect, useState } from 'react';
import './ConfigPage.css';


import { axiosInstance } from '../../api/axiosInstance';

import type { ButtonConfig, FormConfig, Setting, TableColumn } from "../../types/PageConfig";

import TabPage from './TabPage';
import TabTable from './TabTable';

import TabForm from './TabForm';
import TabButton from './TabButton';



const ConfigPage = () => {
    const [currentConfig, setCurrentConfig] = useState<string>('page');

    const [settingsList, setSettingsList] = useState<Setting[]>([]);
    const [currentSetting, setCurrentSetting] = useState<Setting>();

    const [pageShow, setPageShow] = useState<boolean>(true);
    const [pagePermission, setPagePermission] = useState<string>('');
    const [pageTitle, setPageTitle] = useState<string>('');

    const [tableSortBy, setTableSortBy] = useState<string>('name');
    const [tableSortDirection, setTableSortDirection] = useState<string>('asc');

    const [tableMethod, setTableMethod] = useState<string>('GET');
    const [tableUrl, setTableUrl] = useState<string>('/api/product/search');
    const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
    const [tableParams] = useState<Record<string, any>>({
        searchTerm: "string",
        sortBy: "string",
        sortDirection: "string",
        page: "number",
        limit: "number"
    });

    const [forms, setForms] = useState<FormConfig[]>([]);

    const [mainButton, setMainButton] = useState<ButtonConfig>(
        { label: "Button", isShow: true }
    );
    const [tableButtons, setTableButtons] = useState<ButtonConfig[]>([]);
    

    //lấy danh sách setting từ be
    const fetchSetting = async () => {
        const config = await axiosInstance.get('/api/setting/list');
        setSettingsList(config.data.settings || []);
        console.log("Fetched settings");
    }
    useEffect(() => {
        fetchSetting();
    }, []);
    const changeConfig = (config: string) => {
        setCurrentConfig(config);
    }
    useEffect(() => {
        if (currentSetting) {
            setPageShow(currentSetting.show || false );
            setPagePermission(currentSetting.config.permission || '');
            setPageTitle(currentSetting.config.pageTitle || '');

            setTableSortBy(currentSetting.config.table.initialSortBy || 'name');
            setTableSortDirection(currentSetting.config.table.initialSortDirection || 'asc');
            setTableColumns(currentSetting.config.table.columns || []);
            setTableMethod(currentSetting.config.table.api.method || 'GET');
            setTableUrl(currentSetting.config.table.api.url || '/api/product/search');

            setForms(currentSetting.config.form || []);
            setMainButton(currentSetting.config.action.mainButton || { key: "mainButton", label: "Button", isShow: true });
            setTableButtons(currentSetting.config.action.tableButtons || []);

        }
    }, [currentSetting]);

    const saveChanges = async () => {
        if (!currentSetting) return;
        const updatedSetting: Setting = {
            ...currentSetting,
            show: pageShow,
            config: {
                ...currentSetting.config,
                permission: pagePermission,
                pageTitle: pageTitle
            }
        };
        try {
            const response = await axiosInstance.patch(`/api/setting/update`, updatedSetting);
            console.log("Updated setting:", response.data);
            setCurrentSetting(response.data.setting);
            fetchSetting();
        } catch (error) {
            console.error("Error updating setting:", error);
        }
    };
    const saveChangesTable = async () => {
        if (!currentSetting) return;
        const updatedSetting: Setting = {
            ...currentSetting,
            config: {
                ...currentSetting.config,
                table: {
                    ...currentSetting.config.table,

                    initialSortBy: tableSortBy,
                    initialSortDirection: tableSortDirection,
                    api: {
                        method: tableMethod,
                        url: tableUrl,
                        params: tableParams
                    }
                }
            }
        };
        try {
            const response = await axiosInstance.patch(`/api/setting/update`, updatedSetting);
            console.log("Updated setting:", response.data);
            setCurrentSetting(response.data.setting);
            fetchSetting();
        } catch (error) {
            console.error("Error updating setting:", error);
        }
    }
    const saveChangesColumns = async () => {
        if (!currentSetting) return;
        const updatedSetting: Setting = {
            ...currentSetting,
            config: {
                ...currentSetting.config,
                table: {
                    ...currentSetting.config.table,
                    columns: tableColumns
                }
            }
        };
        try {
            const response = await axiosInstance.patch(`/api/setting/update`, updatedSetting);
            console.log("Updated setting:", response.data);
            setCurrentSetting(response.data.setting);
            fetchSetting();
        } catch (error) {
            console.error("Error updating setting:", error);
        }
    }
    
    const saveChangesForm = async () => {
        if (!currentSetting) return;
        const updatedSetting: Setting = {
            ...currentSetting,
            config: {
                ...currentSetting.config,
                form: forms
            }
        };
        try {
            const response = await axiosInstance.patch(`/api/setting/update`, updatedSetting);
            console.log("Updated setting:", response.data);
            setCurrentSetting(response.data.setting);
            fetchSetting();
        } catch (error) {
            console.error("Error updating setting:", error);
        }
    }

    const saveChangesButtons = async () => {
        if (!currentSetting) return;
        const updatedSetting: Setting = {
            ...currentSetting,
            config: {
                ...currentSetting.config,
                action: {
                    mainButton: mainButton || { key: "", label: "", icon: "" },
                    tableButtons: tableButtons
                }
            }
        };
        try {
            const response = await axiosInstance.patch(`/api/setting/update`, updatedSetting);
            console.log("Updated setting:", response.data);
            setCurrentSetting(response.data.setting);
            fetchSetting();
        } catch (error) {
            console.error("Error updating setting:", error);
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
      
    return (
        <div className="config-page">
            <div className="config-header">
                <div className="config-header-buttons">
                    <button className={`config-header-button ${currentConfig=='page' ? "button-active" : ""}`} onClick={() => {changeConfig('page')}}> Page</button>
                    <button className={`${currentSetting ? "" : "disabled"} config-header-button ${currentConfig=='table' ? "button-active" : ""}`} onClick={() => {changeConfig('table')}}>Table</button>
                    <button className={`${currentSetting ? "" : "disabled"} config-header-button ${currentConfig=='button' ? "button-active" : ""}`} onClick={() => {changeConfig('button')}}>Button</button>
                    <button className={`${currentSetting ? "" : "disabled"} config-header-button ${currentConfig=='form' ? "button-active" : ""}`} onClick={() => {changeConfig('form')}}>Form</button>
                </div>
            </div>
            {(currentConfig==='page') && (
                <TabPage
                    settingsList={settingsList}
                    currentSetting={currentSetting}
                    setCurrentSetting={setCurrentSetting}
                    pageShow={pageShow}
                    setPageShow={setPageShow}
                    pagePermission={pagePermission}
                    setPagePermission={setPagePermission}
                    pageTitle={pageTitle}
                    setPageTitle={setPageTitle}
                    saveChanges={saveChanges} 
                    fetchSetting={fetchSetting}
                />
            )}
            {(currentConfig==='table') && (
                <TabTable
                    pageTitle = {pageTitle}
                    tableSortBy = {tableSortBy}
                    setTableSortBy = {setTableSortBy}
                    tableSortDirection = {tableSortDirection}
                    setTableSortDirection = {setTableSortDirection}
                    tableUrl = {tableUrl}
                    setTableUrl = {setTableUrl}
                    tableMethod = {tableMethod}
                    setTableMethod = {setTableMethod}
                    tableColumns = {tableColumns}
                    setTableColumns = {setTableColumns}
                    saveChangesTable = {saveChangesTable}
                    saveChangesColumns = {saveChangesColumns}
                />

            )}
            {(currentConfig==='button') && (
                <TabButton
                    mainButton={mainButton}
                    setMainButton={setMainButton}
                    tableButtons={tableButtons}
                    setTableButtons={setTableButtons}
                    saveChangesButtons={saveChangesButtons}
                />
            )}
            {(currentConfig==='form') && (
                <TabForm
                    forms={forms}
                    setForms={setForms}
                    saveChangesForm={saveChangesForm}
                />
            )}
            
        </div>
    );
}

export default ConfigPage;