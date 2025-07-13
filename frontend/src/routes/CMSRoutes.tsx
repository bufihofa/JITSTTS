import { Navigate, Route, Routes } from "react-router-dom";
import CMSLayout from "../component/CMSLayout";
import DashBoard from "../pages/home/DashBoard";
import RoleList from "../pages/manage/RoleList";
import UserList from "../pages/manage/UserList";
import DynamicPage from "../pages/manage/DynamicPage";
import ConfigurationApp from "../pages/setting/SettingPage";
import ConfigPage from "../pages/setting/ConfigPage";
const CMSRoutes: React.FC = () => {
  return (
    <CMSLayout>
        <Routes>
            <Route path="home" element={<div>Home</div>} />
            <Route path="dashboard" element={<DashBoard/>} />
            <Route path="products" element={<DynamicPage/>} />
            <Route path="users" element={<UserList/>} />
            <Route path="about" element={<div>About</div>} />
            <Route path="config" element={<ConfigPage/>} />
            <Route path="settings" element={<ConfigurationApp />} />
            <Route path="permissions" element={<RoleList/>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </CMSLayout>
  );
}
export default CMSRoutes;   