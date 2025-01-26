import React from 'react';
import { createRoot } from 'react-dom/client'
import NuApp from './NuApp';

const root = createRoot(document.getElementById('root')!);

root.render(
      <NuApp />
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

window.Buffer = window.Buffer || require("buffer").Buffer; 

console.log = function() {
  var logDiv = document.getElementById("log");
  if(logDiv)
    logDiv.innerHTML += Array.from(arguments).join(' ') + '\n<br/>';
    logDiv!.scrollTop = logDiv!.scrollHeight;
}