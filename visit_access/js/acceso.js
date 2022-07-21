const handleLogin = async () => {
    const user = document.querySelector("#txtUser").value.trim();
    const pass = document.querySelector("#txtPass").value.trim();

    if(user === "" || pass === ""){
        NotifyError("Missing data to capture");
        return;
    }

    await CallPost(`${API_CONFIGURATION}/users/authenticate`,{
        username: user,
        password: pass
    }).then(res=>{
        const infoUser = res.data.user;
        let userRoutes = [];
        if(infoUser){
            //EL USUARIO TIENE ROLES??
            if(infoUser.userRoles.length > 0){
              // ROLES DEL USUARIO DE ESTE MODOULO
              const userRolesThisModule = infoUser.userRoles.filter(ur => ur.role.module.description.toLowerCase() == MODULE.toLowerCase()).map(ur => ur.role);
              if(userRolesThisModule.length > 0){
                //ROLES DEL USUARIO QUE TRAEN VISTAS
                const userRolesWtViews = userRolesThisModule.filter(r=> r.roleViews.length > 0);
                if(userRolesWtViews.length > 0){
                  userRoutes = userRolesWtViews[0].roleViews.map(urv => urv.view.path);
                }
              }
            }
        } 

        if(userRoutes.filter(path => path === "/visits").length > 0){
            sessionStorage.setItem("_authVisitorAccess", JSON.stringify(res.data.user));
            sessionStorage.setItem("_authTokenVisitorAccess", JSON.stringify(res.data.jwtToken));
            sessionStorage.setItem("_authRoutesVisitorAccess", JSON.stringify(userRoutes));
            //REDIRECCIONANDO
            location.href = "./Visits.html";
            return;
        } 
        if(userRoutes.filter(path => path === "/schedule").length > 0){
            sessionStorage.setItem("_authVisitorAccess", JSON.stringify(res.data.user));
            sessionStorage.setItem("_authTokenVisitorAccess", JSON.stringify(res.data.jwtToken));
            sessionStorage.setItem("_authRoutesVisitorAccess", JSON.stringify(userRoutes));
            //REDIRECCIONANDO
            location.href = "./Schedule.html";
            return;
        } 
        if(userRoutes.filter(path => path === "/setting").length > 0){
            sessionStorage.setItem("_authVisitorAccess", JSON.stringify(res.data.user));
            sessionStorage.setItem("_authTokenVisitorAccess", JSON.stringify(res.data.jwtToken));
            sessionStorage.setItem("_authRoutesVisitorAccess", JSON.stringify(userRoutes));
            //REDIRECCIONANDO
            location.href = "./Setting.html";
            return;
        } 
        NotifyError("You do not have permission in the app");
        return;
    }).catch(error => {
        NotifyError(error.response.data.message);
    });
}

(()=>{
    sessionStorage.removeItem("_authVisitorAccess");
    sessionStorage.removeItem("_authTokenVisitorAccess");
    sessionStorage.removeItem("_authRoutesVisitorAccess");
})();