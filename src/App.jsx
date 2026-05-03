import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Camera from "./Camera";

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;