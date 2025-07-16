import React, { createContext, useContext, useEffect, useState } from "react";
import type { Setting } from "../types/PageConfig";
import { axiosInstance } from "../api/axiosInstance";

type SettingContextType = {
  settings: Setting[];
  perms: string[];
  checkPerm: (requiredPerm?: string) => boolean;
};

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [perms, setPerms] = useState<string[]>([]);

  

  const fetchPageSetting = async () => {
      try {
          const settings = await axiosInstance.get('/api/setting/fetch');
          if (!settings.data || !settings.data.settings) {
              console.error("No settings found in the response");
              return;
          }
          const sets = settings.data.settings || [];
          const pers = settings.data.perms || [];

          const doneSets: Setting[] = [];

          sets.forEach((setting: Setting) => {
              if(checkPerm2(pers, setting.config.permission)) {
                  doneSets.push(setting);
              }
          });

          setSettings(doneSets);
          setPerms(pers);

          console.log("Settings: ", settings.data.settings || []);
          console.log("Perms: ", settings.data.perms || []);
      }
      catch (error) {
          console.error("Error fetching page config:", error);
          throw error;
      }
  }

  useEffect(() => {
      fetchPageSetting();
  }, []);

  const checkPerm2 = (pers: string[], requiredPerm?: string) => {
      if (!requiredPerm) {
          return true; 
      }
      console.log("###Checking permission for:", requiredPerm);

      if (pers.includes('*')) {
          return true; 
      }
      if (pers.includes(requiredPerm)) {
        return true;
      }


      const permParts = requiredPerm.split('.');
      let currentPerm = '';
      for (let i = 0; i < permParts.length - 1; i++) {
          currentPerm += (i > 0 ? '.' : '') + permParts[i];
          const wildcardPerm = `${currentPerm}.*`;
          if (pers.includes(wildcardPerm)) {
          return true;
          }
      }
    
    return false;
  }
  const checkPerm = (requiredPerm?: string) => {
      if (!requiredPerm) {
          return true; 
      }
      console.log("###Checking permission for:", requiredPerm);

      if (perms.includes('*')) {
          return true; 
      }
      if (perms.includes(requiredPerm)) {
        return true;
      }


      const permParts = requiredPerm.split('.');
      let currentPerm = '';
      for (let i = 0; i < permParts.length - 1; i++) {
          currentPerm += (i > 0 ? '.' : '') + permParts[i];
          const wildcardPerm = `${currentPerm}.*`;
          if (perms.includes(wildcardPerm)) {
          return true;
          }
      }
    
    return false;
  }

  return (
    <SettingContext.Provider value={{ settings, perms, checkPerm }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) throw new Error("useSetting must be used within a SettingProvider");
  return context;
};