import React from "react";
import { FaHouse, FaBoxArchive, FaUsers, FaCircleInfo, FaKey   } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./common/ThemeToggle";
const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(true);
        const toggleSidebar = () => {
            console.log("Toggle sidebar");
        setIsOpen(!isOpen);
    };
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
                <div className="sidebar-item">
                    <NavLink to="/dashboard" className="sidebar-link">
                        
                        <span className="sidebar-text"><FaHouse className="sidebar-icon" /> Dashboard</span>
                    </NavLink>
                </div>
                <div className="sidebar-item">
                    <NavLink to="/products" className="sidebar-link">
                        
                        <span className="sidebar-text"><FaBoxArchive className="sidebar-icon" /> Products</span>
                    </NavLink>
                </div>
                <div className="sidebar-item">
                    <NavLink to="/config" className="sidebar-link">
                        
                        <span className="sidebar-text"><FaBoxArchive className="sidebar-icon" /> Config</span>
                    </NavLink>
                </div>
                {true && (
                    <>
                        <div className="sidebar-item">
                            <NavLink to="/users" className="sidebar-link">
                                
                                <span className="sidebar-text"><FaUsers className="sidebar-icon" /> Users</span>
                            </NavLink>
                        </div>

                        <div className="sidebar-item">
                            <NavLink to="/permissions" className="sidebar-link">
                                
                                <span className="sidebar-text"><FaKey className="sidebar-icon" /> Permissions</span>
                            </NavLink>
                        </div>
                    </>
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