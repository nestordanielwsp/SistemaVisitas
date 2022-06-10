import { Route, HashRouter, Redirect } from "react-router-dom";
import Revision from "./Pages/Revision";
import Historico from "./Pages/Historico";
import Content from "./Template/Content";
import {AppContext} from "./Helpers/AppProvider";
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { useContext, useEffect } from 'react';
import Login from './Pages/Login';
import { useIsAuthenticated, useAuthUser, useSignOut } from 'react-auth-kit';
import { modulo } from '../config.js';

export default function App() {
  const folio = (window.location.href.split('=').length > 0 ? window.location.href.split('=').reverse()[0] : null);
  const authUser = useAuthUser();
  const singOut = useSignOut();
  const isAuthenticated = useIsAuthenticated();
  const isAuth = isAuthenticated();
  const infoUser = authUser();
  const [state, setState] = useContext(AppContext);

  let userRoutes = [];
  if(infoUser){
    //EL USUARIO TIENE ROLES??
    if(infoUser.userRoles.length > 0){
      // ROLES DEL USUARIO DE ESTE MODOULO
      const userRolesThisModule = infoUser.userRoles.filter(ur => ur.role.module.description.toLowerCase() === modulo.toLowerCase()).map(ur => ur.role);
      if(userRolesThisModule.length > 0){
        //ROLES DEL USUARIO QUE TRAEN VISTAS
        const userRolesWtViews = userRolesThisModule.filter(r=> r.roleViews.length > 0);
        if(userRolesWtViews.length > 0){
          userRoutes = userRolesWtViews[0].roleViews.map(urv => urv.view.path);
        }
      }
    }
  }
  useEffect(()=>{
    if(!isAuth)
      setState(p => ({...p, folio: folio}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  if(!isAuth){
    return (<>
      {state.loading ? <LoadingOverlay style={{zIndex: "2000"}}><Loader fullPage loading /></LoadingOverlay> : <></>}
      <HashRouter>
        <Route exact path='/' render={() =>
          <Login titulo="Review IT Devices" />
        }/>
        <Route path='*' render={() =>
          <Redirect to="/" push />
        }/>
      </HashRouter>
    </>);
  }

  return (<>
    {state.loading ? <LoadingOverlay style={{zIndex: "2000"}}><Loader fullPage loading /></LoadingOverlay> : <></>}
    <HashRouter>
      <Route exact path='/' render={() => {
        let rutaRedirigida = "/401";
        if(userRoutes.filter(path => path === "/revision").length > 0)
          rutaRedirigida = `/revision${!state.folio ? '' : `?id=${state.folio}`}`;
        else if(userRoutes.filter(path => path === "/historico").length > 0)
          rutaRedirigida = "/historico";

        return (<Redirect to={rutaRedirigida} />)
      }}/>
      <Route exact path='/revision' render={() =>
        (userRoutes.filter(path => path === "/revision").length > 0) ? <Content><Revision /></Content> : <Redirect to='/' />
      }/>
      <Route exact path='/historico' render={() =>
        (userRoutes.filter(path => path === "/historico").length > 0) ? <Content><Historico /></Content> : <Redirect to='/' />
      }/>
      <Route exact path='/401' render={() =>
        <div className="card-body text-center"><h4>You do not have permissions, please contact the administrator</h4><button className="btn btn-primary" onClick={ev=>{singOut();}}>Sign out</button></div>
      }/>
    </HashRouter>
  </>);
}


