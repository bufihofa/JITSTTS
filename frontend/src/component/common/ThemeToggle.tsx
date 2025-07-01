import { useEffect, useState } from 'react';
import storage from '../../utils/storage';
import './ThemeToggle.css';
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";

import { FaRegCircle } from "react-icons/fa6";
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(storage.getTheme());
  
  useEffect(() => {
    // Set the theme when component mounts
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <>
      
      <button className="theme-toggle" onClick={toggleTheme}>
          <div className={`theme-icon ${theme === 'light' ? 'theme-icon-light' : 'theme-icon-dark'}`}>
              {theme === 'light' ? <MdOutlineWbSunny className="theme-icon-sun"  /> : <IoMoonOutline className="theme-icon-moon"/>}
          </div>
          <div className="theme-circle">
              <FaRegCircle className={theme === 'light' ? 'theme-circle-light' : 'theme-circle-dark'} />
          </div>
        </button>
      </>
  );
};

export default ThemeToggle;