import { Navigate, Route, Routes } from "react-router-dom";
import CMSLayout from "../component/layout/CMSLayout";
import ProductList from "../pages/manage/ProductList";

const CMSRoutes: React.FC = () => {
  return (
    <CMSLayout>
        <Routes>
            <Route path="home" element={<div>Home</div>} />

            <Route path="products" element={<ProductList   />} />
            <Route path="users" element={<div>User</div>} />

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </CMSLayout>
  );
}
export default CMSRoutes;   