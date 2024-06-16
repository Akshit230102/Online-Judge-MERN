import React from 'react'
import Navbar from '../Navbar/Navbar'
import picture from '../../Assets/error_401.jpg'

const Error = () => {
  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: '#eaeae8' , display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={picture} alt="Centered Image" style={{ maxWidth: '100%', maxHeight: '100%' , border: 'none', margin: '0', padding: '0'}} />
    </div>
    </div>
  )
}

export default Error;
