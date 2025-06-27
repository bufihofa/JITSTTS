const storage = {

    getToken:() =>  localStorage.getItem("TOKEN"),
    setToken:(token: string) => localStorage.setItem("TOKEN", token),

    setRole:(role: string) => localStorage.setItem("ROLE", role),
    getRole:() => localStorage.getItem("ROLE") || "user",

    setUser:(username: string) => localStorage.setItem("USER", username),
    getUser:() => localStorage.getItem("USER") || "guest",

    setLoginData:(token: string, role: string, username: string) => {
        localStorage.setItem("TOKEN", token);
        localStorage.setItem("ROLE", role);
        localStorage.setItem("USER", username);
    },
    clearLoginData:() => {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("ROLE");
        localStorage.removeItem("USER");
    },
    getTheme:() => localStorage.getItem("THEME") || "light",
    setTheme:(theme: string) => localStorage.setItem("THEME", theme),

    getLastAccess:() => localStorage.getItem("LAST_ACCESS"),
    setLastAccess:() => localStorage.setItem("LAST_ACCESS", new Date().toISOString()),

}

export default storage;