
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomeButton from './components/HomeButton'
import { Analytics } from "@vercel/analytics/react";

function App() {
  

  return (
    <>
    
    <main className='min-h-screen '>
      <HomeButton />
      <Outlet />
    </main>
    <Navbar />
    <Analytics />
     
    </>
  )
}

export default App
