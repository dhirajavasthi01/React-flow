import React from 'react';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="header-div"></div>
      <div className="header"></div>
      
      <div className="content">
        <div className="sidebar"></div>
        <div className="main">
          <div className="top-container"></div>
          <div className="bottom-container">
            {children}
          </div>
        </div>
      </div>
      
      <div className="footer-div"></div>
      <div className="footer"></div>
    </div>
  );
};

export default MainLayout;