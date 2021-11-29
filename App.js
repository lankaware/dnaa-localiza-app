import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from "react-error-boundary"

import 'fontsource-roboto';
import './bootstrap.css';
import './App.css';
import AppRouters from '../src/components/layout/AppRouters'
import AppMenu from '../src/components/layout/AppMenu'
import Authentic from './components/layout/Authentication.jsx'

import { Context } from './context/AuthContext.jsx'

import './services/customTheme'

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
