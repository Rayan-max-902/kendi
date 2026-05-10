import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; padding: 20px;"><h1>CRITICAL ERROR</h1><p>#root element not found in HTML.</p></div>';
} else {
  try {
    console.log("React: Attempting to create root...");
    const root = createRoot(rootElement);
    console.log("React: Root created, rendering App...");
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("React: Initial render call complete.");
  } catch (error) {
    console.error("React Build/Render Error:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: #ec1c24; font-family: system-ui;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 10px;">Erreur d'initialisation</h1>
        <p style="margin-bottom: 20px; font-weight: 500;">L'application n'a pas pu s'afficher. Voici l'erreur technique :</p>
        <pre style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; overflow: auto; max-width: 100%;">
${error instanceof Error ? error.stack : String(error)}
        </pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ec1c24; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
          Recharger la page
        </button>
      </div>
    `;
  }
}
