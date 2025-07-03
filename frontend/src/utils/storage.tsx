const storage = {
    saveLoginData: (token: string, role: string, username: string) => {
        localStorage.setItem("TOKEN", token);
        localStorage.setItem("ROLE", role);
        localStorage.setItem("USER", username);
    },
    setLoginData:(token: string, role: string, username: string) => {
        sessionStorage.setItem("TOKEN", token);
        sessionStorage.setItem("ROLE", role);
        sessionStorage.setItem("USER", username);
    },
    clearLoginData:() => {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("ROLE");
        localStorage.removeItem("USER");

        sessionStorage.removeItem("TOKEN");
        sessionStorage.removeItem("ROLE");
        sessionStorage.removeItem("USER");
    },

    getToken:() =>  {
        const token = sessionStorage.getItem("TOKEN");
        if (token) {
            return token;
        } else {
            const token = localStorage.getItem("TOKEN");
            const role = localStorage.getItem("ROLE");
            const user = localStorage.getItem("USER");

            if (token && role && user) {
                sessionStorage.setItem("TOKEN", token);
                sessionStorage.setItem("ROLE", role);
                sessionStorage.setItem("USER", user);
            }
                
            return sessionStorage.getItem("TOKEN");
        }
    },
    setToken:(token: string) => sessionStorage.setItem("TOKEN", token),

    setRole:(role: string) => sessionStorage.setItem("ROLE", role),
    getRole:() => sessionStorage.getItem("ROLE") || "user",

    setUser:(username: string) => sessionStorage.setItem("USER", username),
    getUser:() => sessionStorage.getItem("USER") || "guest",

    
    getTheme:() => localStorage.getItem("THEME") || "light",
    setTheme:(theme: string) => localStorage.setItem("THEME", theme),

    getLastAccess:() => localStorage.getItem("LAST_ACCESS"),
    setLastAccess:() => localStorage.setItem("LAST_ACCESS", new Date().toISOString()),

}

export default storage;