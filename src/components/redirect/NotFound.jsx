import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbError404 } from 'react-icons/tb'
import "./redirect.css"

function NotFound () {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='not-found'>
      <TbError404 className='img-404' />
      <h1>tlhogela go kgotlakgotla!</h1>
      <p>Redirecting to home page...</p>
    </div>
  )
}

export default NotFound
