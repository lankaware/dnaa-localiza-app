import React from 'react'
import ReactDOM from 'react-dom'
import '../src/css/index.css'
import '../src/css/bootstrap.min.css'
import { ThemeProvider } from '@mui/material'
import { theme } from './services/customtheme'

import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
