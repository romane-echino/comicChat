import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from "react-router-dom";
import App from './App';


const root = createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );