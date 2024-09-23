import React from 'react'
import './App.css'
import AllRoutes from './Routers/AllRoutes'
import { BrowserRouter } from 'react-router-dom'
import AosAnimation from './components/AosAnimation'
function App() {

  return (
    
    <BrowserRouter>
      <AosAnimation/>
      <AllRoutes/>
    </BrowserRouter>
  )
}

export default App
