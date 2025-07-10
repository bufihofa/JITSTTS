import { Navigate, Route, Routes } from "react-router-dom";
import CMSLayout from "../component/CMSLayout";
import ProductList from "../pages/manage/ProductList";
import DashBoard from "../pages/home/DashBoard";
import RoleList from "../pages/manage/RoleList";

const CMSRoutes: React.FC = () => {
  return (
    <CMSLayout>
        <Routes>
            <Route path="home" element={<div>Home</div>} />
            <Route path="dashboard" element={<DashBoard/>} />
            <Route path="products" element={<ProductList/>} />
            <Route path="users" element={<div>User</div>} />
            <Route path="about" element={<div>About</div>} />
            <Route path="permissions" element={<RoleList/>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </CMSLayout>
  );
}
export default CMSRoutes;   