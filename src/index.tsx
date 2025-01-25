import React from 'react';
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from "react-router-dom";
import NuApp from './NuApp';

const root = createRoot(document.getElementById('root')!);

root.render(
    <MemoryRouter>
      {/*<App /> */}
      <NuApp />
    </MemoryRouter>
);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceworker.js', {
        scope: '/'
      })
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}


console.log = function() {
  var logDiv = document.getElementById("log");
  if(logDiv)
    logDiv.innerHTML += Array.from(arguments).join(' ') + '\n<br/>';
    logDiv!.scrollTop = logDiv!.scrollHeight;
}