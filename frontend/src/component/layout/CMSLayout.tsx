import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import './CMSLayout.css';
const CMSLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
export default CMSLayout;