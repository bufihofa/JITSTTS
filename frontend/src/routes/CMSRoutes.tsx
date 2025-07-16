import { Navigate, Route, Routes } from "react-router-dom";
import CMSLayout from "../component/CMSLayout";
import RoleList from "../pages/manage/RoleList";
import UserList from "../pages/manage/UserList";
import DynamicPage from "../pages/manage/DynamicPage";
import ConfigPage from "../pages/setting/ConfigPage";
import { useSetting } from "../context/useSetting";
import { useEffect } from "react";
import Home from "../pages/home/Home";
const CMSRoutes: React.FC = () => {
  
  const { settings } = useSetting();
  useEffect(() => {
    console.log("CMSRoutes settings:", settings);
  }, [settings]);

  return (
      <CMSLayout>
          <Routes>
              <Route path="home" element={<Home/>} />
              {(settings.map((setting, index) => (
                  <Route 
                      key={index} 
                      path={setting.id} 
                      element={
                          <DynamicPage pageConfig={setting.config}/>
                      } 
                  />
              )))}

              
              <Route path="about" element={<div>About</div>} />
              <Route path="config" element={<ConfigPage/>} />
              <Route path="role" element={<UserList/>} />
              <Route path="permissions" element={<RoleList/>} />
              <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
      </CMSLayout>
  );
}
export default CMSRoutes;   