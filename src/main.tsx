import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("App starting...");

window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught:", message, error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red;"><h1>App Error</h1><p>${message}</p></div>`;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Error: Root element not found!");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log("App rendered successfully.");
  } catch (error) {
    console.error("Critical Error during React initialization:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h1>Erreur au démarrage</h1>
      <p>L'application n'a pas pu démarrer. Cela peut être dû à un problème de connexion ou de configuration.</p>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
  }
}
