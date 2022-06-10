import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import "./css/fontMagna.css"
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import 'react-overlay-loader/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from "./Components/Helpers/AppProvider";
import { AuthProvider } from 'react-auth-kit'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider authType = {'localstorage'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}>
      <AppProvider>
        <App />
        <ToastContainer
          theme="colored"
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
