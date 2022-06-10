import { useRoutes, Navigate } from 'react-router-dom';
import routes from './router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { useIsAuthenticated } from 'react-auth-kit';
import BaseLayout from 'src/layouts/BaseLayout';
import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useAuthUser } from 'react-auth-kit';
import { modulo } from './config';
import _ from 'lodash';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Page Login
const Login = Loader(lazy(() => import('src/content/login')));

const GetRoutes = (isAuth, infoUser)=>{
  //const nav = useNavigate();
  let userRoutes = [];
  if(infoUser){
    //EL USUARIO TIENE ROLES??
    if(infoUser.userRoles.length > 0){
      // ROLES DEL USUARIO DE ESTE MODOULO
      const userRolesThisModule = infoUser.userRoles.filter(ur => ur.role.module.description.toLowerCase() == modulo.toLowerCase()).map(ur => ur.role);
      if(userRolesThisModule.length > 0){
        //ROLES DEL USUARIO QUE TRAEN VISTAS
        const userRolesWtViews = userRolesThisModule.filter(r=> r.roleViews.length > 0);
        if(userRolesWtViews.length > 0){
          userRoutes = userRolesWtViews[0].roleViews.map(urv => urv.view.path);
        }
      }
    }
  }

  if(isAuth){
    return routes(userRoutes);
  }else{
    return [{
      path: '*',
      element: <BaseLayout />,
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: '*',
          element: <Navigate to="/login" replace />
        },
      ]
    }]
  }
}

const App = () => {
  const infoUserAuth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const content = useRoutes(GetRoutes(isAuthenticated(), infoUserAuth()));

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
