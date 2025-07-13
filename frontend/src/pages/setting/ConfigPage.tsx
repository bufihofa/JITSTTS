import { useEffect, useMemo, useState } from 'react';
import './ConfigPage.css';

import { CiSettings, CiViewTable  } from "react-icons/ci";
import { SiReacthookform } from "react-icons/si";
import { PiCursorThin } from "react-icons/pi";
import { axiosInstance } from '../../api/axiosInstance';

import type { FormConfig, PageConfig, APIConfig, Setting } from "../../types/PageConfig";
import { productPageConfig } from '../manage/DynamicPage';
import Button from '../../component/common/Button';
import { FaKey } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { IoSettingsSharp } from "react-icons/io5";
import { GrConfigure } from "react-icons/gr";



const ConfigPage = () => {
    const [currentConfig, setCurrentConfig] = useState<string>('page');

    const [settingsList, setSettingsList] = useState<Setting[]>([]);
    const [currentSetting, setCurrentSetting] = useState<Setting>();

    useEffect(() => {
        fetchSetting();
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PAGE TAB

    //đổi sang tab khác
    const changeConfig = (config: string) => {
        setCurrentConfig(config);
    }
    //lấy danh sách config từ be
    const fetchSetting = async () => {
        const config = await axiosInstance.get('/api/setting/list');
        setSettingsList(config.data.settings || []);
        console.log("Fetched settings");
    }
    //tạo một config mới với cấu hình mặc định
    const createSetting = async () => {
        const temp: PageConfig = {...productPageConfig};
        const config = await axiosInstance.post('/api/setting/create', {
            name: 'New Setting',
            show: true,
            config: temp
        });
        fetchSetting();
        console.log("config", config.data);
    }
    //hiển thị danh sách config
    const renderListSettings = () => {
        return (
            <div className="config-page-list">
                {settingsList.map((setting, index) => (
                    <div 
                        key={index} 
                        className={`config-page-item ${currentSetting?.id === setting?.id ? 'active' : ''}`}
                        onClick={() => setCurrentSetting(setting)}
                    >
                        <p className="config-page-item-id">{setting.id}</p>
                    </div>
                ))}
            </div>
        );
    }
    //hiển thị thông tin của config hiện tại
    const renderCurrentSetting = () => {
        if (!currentSetting) return <p className="config-page-no-setting">No setting selected</p>;
        return (
            <div className="config-page-current">
                <h3 className="config-page-current-title">{currentSetting.config.pageTitle}</h3>
                <p>ID: {currentSetting.id}</p>

                <pre className="config-page-current-config">{JSON.stringify(currentSetting, null, 2)}</pre>
            </div>
        );
    }
    //hiển thị tab PAGE CONFIG
    const renderPageConfig = () => {
        return (
        <div className="page-tab-container">
          <div className="role-item">
            <div className="role-header">
              <div className="role-header-container">
                <IoSettingsSharp className="role-icon" />
                <p className="role-title">Config Page</p>
                <div className="role-header-button">
                  <Button 
                    onAddButton={createSetting}
                    text="Add Page"
                  />
                </div>
              </div>
              
            </div>
            <div className="role-content">
              <div className="role-list">
                
                {settingsList.map((setting) => (
                    <div key={setting.id} className={`${currentSetting?.id === setting.id ? "selected" : ""} role-item-row`}>
                    <input
                        type="radio"
                        name="selectedRole"
                        value={setting.id}
                        checked={currentSetting?.id === setting.id}
                    />
                    <div className="role-item-info" onClick={() => setCurrentSetting(setting)}>
                        <p className="role-name">
                        
                        {setting.config.pageTitle || "Dynamic Page"}
                        </p>
                    </div>
                    <button className="role-button-delete"> 
                        <MdDelete /> 
                    </button>
                    </div>
                ))}
              </div>
            </div>
            
            
          </div>
          <div className={`role-item ${currentSetting ? "" : "disabled"}`}>
            <div className="role-header">
              <div className="role-header-container">
                <GrConfigure className="role-icon" />
                <p className="role-title">{currentSetting?.config.pageTitle || ""} Page</p>
                
              </div>
              
            </div>
            <div className="role-content">
              <div className="role-list">
                
              </div>
            </div>
            
            <div className={`role-save-button`}>
              <Button 
                onAddButton={() => {}}
                text="Save Changes"
              />
            </div>
          </div>
        </div>
        );
      }
    
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const renderTableConfig = () => {
        return (
            <div className="config-page-table">
                <h3 className="config-page-table-title">Table Config</h3>
                <pre className="config-page-current-config">{JSON.stringify(currentSetting?.config.table, null, 2)}</pre>
            </div>
        );
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const renderButtonConfig = () => {
        return (
            <div className="config-page-button">
                <h3 className="config-page-button-title">Button Config</h3>
                <pre className="config-page-current-config">{JSON.stringify(currentSetting?.config.action, null, 2)}</pre>
            </div>
        );
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const renderFormConfig = () => {
        return (
            <div className="config-page-form">
                <h3 className="config-page-form-title">Form Config</h3>
                <pre className="config-page-current-config">{JSON.stringify(currentSetting?.config.form, null, 2)}</pre>
            </div>
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //FINAL
    
      
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
            {(currentConfig==='page') && (renderPageConfig())}
            {(currentConfig==='table') && (renderTableConfig())}
            {(currentConfig==='button') && (renderButtonConfig())}
            {(currentConfig==='form') && (renderFormConfig())}
            
        </div>
    );
}

export default ConfigPage;