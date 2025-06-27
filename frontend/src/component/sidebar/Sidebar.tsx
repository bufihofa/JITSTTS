import React from "react";
import { FaHouse, FaBoxArchive } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(true);
        const toggleSidebar = () => {
            console.log("Toggle sidebar");
        setIsOpen(!isOpen);
    };
    return(
        <aside className="app-sidebar">
            <div className="logo-sidebar">
                <img src="/bh_logo.png" alt="Logo" className="logo-sidebar" onClick={toggleSidebar} />
            </div>
            <div className="sidebar-menu">
                <div className="sidebar-item">
                    <NavLink to="/home" className="sidebar-link">
                        <FaHouse className="sidebar-icon" />
                        <span className="sidebar-text">Home</span>
                    </NavLink>
                </div>
                <div className="sidebar-item">
                    <NavLink to="/products" className="sidebar-link">
                        <FaBoxArchive className="sidebar-icon" />
                        <span className="sidebar-text">Products</span>
                    </NavLink>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;