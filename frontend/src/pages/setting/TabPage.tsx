import { IoSettingsSharp } from "react-icons/io5";
import { axiosInstance } from "../../api/axiosInstance";
import CMSInput from "../../component/common/Input";
import type { PageConfig, Setting } from "../../types/PageConfig";
import { productPageConfig } from "../manage/DynamicPage";
import Button from "../../component/common/Button";
import { MdDelete } from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
interface TabPageProps {
    settingsList: Setting[];
    currentSetting?: Setting;
    setCurrentSetting: (setting: Setting | undefined) => void;
    fetchSetting: () => void;
    pageTitle: string;
    setPageTitle: (title: string) => void;
    pagePermission: string;
    setPagePermission: (permission: string) => void;
    pageShow: boolean;
    setPageShow: (show: boolean) => void;
    saveChanges: () => void;
}
const TabPage: React.FC<TabPageProps> = (
{
    settingsList, 
    currentSetting, 
    setCurrentSetting, 
    fetchSetting, 
    pageTitle, 
    setPageTitle, 
    pagePermission, 
    setPagePermission, 
    pageShow, 
    setPageShow, 
    saveChanges

}) => {

    
    
    //tạo một setting mới với cấu hình mặc định
    const createSetting = async () => {
        const temp: PageConfig = {...productPageConfig};
        const config = await axiosInstance.post('/api/setting/create', {
            show: false,
            config: temp
        });
        fetchSetting();
        console.log("config", config.data);
    }
    const deleteSetting = async (id: string) => {
        try {
            await axiosInstance.delete(`/api/setting/delete`, { data: { id } });
            if(currentSetting?.id === id) {
                setCurrentSetting(undefined);
            }
            fetchSetting();
            console.log("Setting deleted successfully");
        } catch (error) {
            console.error("Error deleting setting:", error);
        }
    }
    //hiển thị thông tin của setting hiện tại
    const renderCurrentSetting = () => {
        if (!currentSetting) return <p className="config-page-no-setting">No setting selected</p>;
        return (
            <div className="config-page-current">
                <p>ID: {currentSetting.id}</p>
                <div className="config-page-current-show">
                    <label>
                        <input
                            type="checkbox"
                            checked={pageShow}
                            onChange={(e) => setPageShow(e.target.checked)}
                        />
                        Show Page
                    </label>
                </div>
                <br />
                <CMSInput
                    label="Page Title"
                    value={pageTitle}
                    onChange={setPageTitle}
                    placeholder="Enter page title"
                />
                <CMSInput
                    label="Page Permission"
                    value={pagePermission}
                    onChange={setPagePermission}
                    placeholder="Enter page permission"
                />
                
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
                        <p className="role-desc">{setting.show? "Showing" : "Hidden"}</p>
                    </div>
                    <button className="role-button-delete" onClick={() => deleteSetting(setting.id)}>
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
                <p className="role-title">{pageTitle || ""} Page</p>
                
                </div>
                
            </div>
            <div className="role-content">
                {renderCurrentSetting()}
            </div>
            
            <div className={`role-save-button`}>
                <Button 
                onAddButton={saveChanges}
                text="Save Changes"
                />
            </div>
            </div>
        </div>
        );
        }
    return (
        <>
        {renderPageConfig()}
        </>
    );
}
export default TabPage;