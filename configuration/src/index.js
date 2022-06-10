import App from './App';
import ReactDOM from 'react-dom';
import 'src/utils/chart';
import * as serviceWorker from './serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit'
import 'nprogress/nprogress.css';
import { SidebarProvider } from './contexts/SidebarContext';

ReactDOM.render(
  <AuthProvider authType = {'localstorage'}
    authName={'_auth'}
    cookieDomain={window.location.hostname}
    cookieSecure={window.location.protocol === "https:"}>
    <HelmetProvider>
      <SidebarProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </SidebarProvider>
    </HelmetProvider>
  </AuthProvider>
  ,document.getElementById('root')
);

serviceWorker.unregister();
