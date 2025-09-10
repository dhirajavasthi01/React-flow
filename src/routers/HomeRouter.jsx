// src/routers/HomeRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import Network from '../pages/network/Network';
// import NodeToolbarExample from '../pages/demo/Demo';


const HomeRouter = () => {
  return (
    <Routes>
      <Route
        path="network"
        element={
          
            <Network />
         
        }
      />
      {/* <Route
        path="demo"
        element={
          
            <NodeToolbarExample />
         
        }
      /> */}
    </Routes>
  );
};

export default HomeRouter;