// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

// Cau hinh Redux store
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

// Cau hinh react-router-dom
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter basename='/'> {/**basename: Code phai chay qua route / moi chay den route tiep theo */}
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'warning', variant: 'outlined' }
        }}>
          <CssBaseline />
          <App />
          <ToastContainer />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
)
