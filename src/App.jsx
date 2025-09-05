import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import HomeRouter from './routers/HomeRouter';
import MainLayout from './layout/MainLayout';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <MainLayout>
            <HomeRouter />
          </MainLayout>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;