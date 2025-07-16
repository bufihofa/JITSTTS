import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import './CMSLayout.css';
const CMSLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  
  return (
    <div className="cms-container">
      <div className="app-container">
        <Sidebar />
        <div className="main-content" >
          <Header />
          <main className="content-area" key={location.pathname}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
export default CMSLayout;