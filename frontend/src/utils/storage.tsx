const storage = {

    getToken:() =>  localStorage.getItem("TOKEN"),
    setToken:(token: string) => localStorage.setItem("TOKEN", token),
    

    getTheme:() => localStorage.getItem("THEME") || "light",
    setTheme:(theme: string) => localStorage.setItem("THEME", theme),

    getLastAccess:() => localStorage.getItem("LAST_ACCESS"),
    setLastAccess:() => localStorage.setItem("LAST_ACCESS", new Date().toISOString()),

}

export default storage;