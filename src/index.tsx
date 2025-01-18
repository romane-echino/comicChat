import React from 'react';
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from "react-router-dom";
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