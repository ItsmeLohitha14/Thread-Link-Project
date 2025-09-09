import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // ✅ Router here
import App from './App';
import './index.css'; // or your styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* ✅ Only HERE */}
      <App />
    </Router>
  </React.StrictMode>
);

