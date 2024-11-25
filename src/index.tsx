import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from "react-router-dom";
import App from './App';
import NuApp from './NuApp';


const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <MemoryRouter>
      {/*<App /> */}
      <NuApp />
    </MemoryRouter>
  </React.StrictMode>
);