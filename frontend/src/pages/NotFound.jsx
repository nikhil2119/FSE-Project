import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/NotFound.css";  // Import the CSS file    

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-secondary">Go Home</Link>
    </div>
  );
};

export default NotFound;
