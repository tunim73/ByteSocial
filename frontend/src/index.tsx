import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import AppRouter from './routes';
import { AuthProvider } from 'contexts/Auth/AuthProvider';
import { MenuProvider } from 'contexts/Menu/MenuProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MenuProvider>
        <AppRouter />
      </MenuProvider>
    </AuthProvider>
  </React.StrictMode>
);
