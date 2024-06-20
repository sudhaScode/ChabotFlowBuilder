import React, { useState } from 'react';
import FlowCanvas from './components/flowbuilder/FlowCanvas';
import "./styles/App.css";
import { SnackbarProvider } from 'notistack';

const App = () => {
 
  return (
    <div className="App">
      <SnackbarProvider>
        <FlowCanvas  />
      </SnackbarProvider>
    </div>
  );
};

export default App;
