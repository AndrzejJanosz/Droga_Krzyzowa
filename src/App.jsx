
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomeButton from './components/HomeButton'

function App() {
  

  return (
    <>
    
    <main className='min-h-screen '>
      <HomeButton />
      <Outlet />
    </main>
    <Navbar />
     
    </>
  )
}

export default App
