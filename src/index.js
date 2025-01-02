import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new `createRoot` method
import './index.css';
import App from './App.tsx';
import { registerLicense } from '@syncfusion/ej2-base'; // Import registerLicense

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0x0WmFZfVtgc19CZ1ZRTGYuP1ZhSXxXd0dhX39ZdHNVTmhYUEY=');

const rootElement = document.getElementById('root'); 

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); 
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
