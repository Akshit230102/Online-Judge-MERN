import React from 'react'
import MainNavbar from '../Navbar/MainNavbar'
import home from '../../Assets/Homepage.png'

const Home = () => {
  return (
    <div>
      <MainNavbar />
      <div style={{ backgroundColor: '#E5E4E2' , display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={home} alt="Centered Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
    </div>
  )
}

export default Home
