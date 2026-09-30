import React from 'react';
import ReactDOM from 'react-dom/client';
import { InvoiceProvider } from './context/InvoiceContext';
import { AppContent } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InvoiceProvider>
      <AppContent />
    </InvoiceProvider>
  </React.StrictMode>
);
