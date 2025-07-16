import React, { useEffect } from "react";
import { FaHouse, FaUsers, FaCircleInfo, FaKey   } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./common/ThemeToggle";
import { useSetting } from "../context/useSetting";
import { IoSettingsSharp } from 'react-icons/io5';

const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(true);
        const toggleSidebar = () => {
            console.log("Toggle sidebar");
        setIsOpen(!isOpen);
    };
    const {settings, checkPerm} = useSetting();

    useEffect(() => {   
        
    }, [settings]);

    return(
        <div className={`${isOpen ? 'app-sidebar' : 'app-sidebar-close'}`}>
            <div className={`${isOpen ? 'logo-sidebar' : 'logo-sidebar-close'}`}>
                <img src="/bh_logo.png" alt="Logo" className="logo-sidebar-img" onClick={toggleSidebar} />
            </div>
            <div className="sidebar-menu">
                <div className="sidebar-item">
                    <NavLink to="/home" className="sidebar-link">
                        
                        <span className="sidebar-text"><FaHouse className="sidebar-icon" /> Home</span>
                    </NavLink>
                </div>


                



                {settings.map((setting, index) => (
                    <div key={index} className="sidebar-item">
                        <NavLink to={`/${setting.id}`} className="sidebar-link">
                            
                            <span className="sidebar-text">• {setting.config.pageTitle}</span>
                        </NavLink>
                    </div>
                ))}
                
                


                {checkPerm("role.admin") && (
                    <div className="sidebar-item">
                        <NavLink to="/role" className="sidebar-link">
                            
                            <span className="sidebar-text"><FaUsers className="sidebar-icon" /> Set Role</span>
                        </NavLink>
                    </div>
                )}
                {checkPerm("role.admin") && (
                    <div className="sidebar-item">
                        <NavLink to="/permissions" className="sidebar-link">
                            
                            <span className="sidebar-text"><FaKey className="sidebar-icon" /> Permissions</span>
                        </NavLink>
                    </div>
                )}
                
                {checkPerm("seting.admin") && (
                    <div className="sidebar-item">
                        <NavLink to="/config" className="sidebar-link">
                            
                            <span className="sidebar-text"><IoSettingsSharp className="sidebar-icon" /> Page Config</span>
                        </NavLink>
                    </div>
                )}
                <div className="sidebar-item">
                    <NavLink to="/about" className="sidebar-link about-link">
                        
                        <span className="sidebar-text"><FaCircleInfo  className="sidebar-icon" /> About</span>
                    </NavLink>
                </div>
                
            </div>
            <div className="sidebar-footer">
                <ThemeToggle    />
            </div>
        </div>
    )
}

export default Sidebar;