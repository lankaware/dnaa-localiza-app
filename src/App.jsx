import React, { useState, useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter as Router } from 'react-router-dom'

import '../src/css/App.css'
import PageHeader from './components/layout/PageHeader.jsx'
import AppMenu from './components/layout/Menu.jsx'
import Content from './components/layout/Content.jsx'
import Authentic from './components/layout/Authentication.jsx'

import { Context } from './context/AuthContext.jsx'
import './services/customtheme'

const App = (props) => {

  const [collapseMenu, setCollapseMenu] = useState(false)

  const toggleMenu = () => {
    setCollapseMenu(!collapseMenu)
  }

  const { authenticated, username } = useContext(Context);

  if (authenticated === false) {
    return (
      <div className='app-content'>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PageHeader
            userName={username}
            toggleMenu={toggleMenu}
            />
          <Authentic />
        </ErrorBoundary>
      </div>
    )
  } else {
    return (
      <div className='app-content'>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <PageHeader
              userName={username}
              toggleMenu={toggleMenu}
            />
            <AppMenu collapseMenu={collapseMenu} />
            <Content />
          </Router>
        </ErrorBoundary>
      </div>
    )
  }
}

function ErrorFallback({ error }) {
  return (
    <div role='alert'>
      <p>Ops, ocorreu um erro na aplicação!</p>
      <p>Por favor, entre em contato com o suporte informando a mensagem abaixo:</p>
      <p />
      <p style={{ color: 'red' }}>{error.message}</p>
    </div>
  )
}

export default App
