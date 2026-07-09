import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// self-hosted fonts (no CDN dependency)
import '@fontsource/kaushan-script/400.css';
import '@fontsource/sora/300.css';
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
