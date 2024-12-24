import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.addEventListener('touchstart', (e) => {
  e.preventDefault();
}, { passive: false });

console.log('React Root Rendering');

root.render(
  <App />
);
