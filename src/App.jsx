import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from "react-error-boundary"

import 'fontsource-roboto';
import './css/bootstrap.min.css';
import './css/App.css';
import AppRouters from './components/layout/AppRouters.jsx'
import AppMenu from './components/layout/AppMenu.jsx'
import Authentic from './components/layout/Authentication.jsx'

import { Context } from './context/AuthContext.jsx'

import './services/customtheme'

function App() {

  const { authenticated, username } = useContext(Context);
  if (authenticated === false) {
    return (
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <AppMenu
              userName={username}
              authenticated={authenticated} />
          <Authentic />
          </Router>
        </ErrorBoundary>
      </div>
    );
  } else {
    return (
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <AppMenu
              userName={username} 
              authenticated={authenticated}/>
            <AppRouters />
          </Router>
        </ErrorBoundary>
      </div>
    );
  }
}

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Ops, ocorreu um erro na aplicação!</p>
      <p>Por favor, entre em contato com o suporte informando a mensagem abaixo:</p>
      <p />
      <p style={{ color: "red" }}>{error.message}</p>
    </div>
  );
}
export default App;
