import React, { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '../components/navigation/Nav'

export default function Layout ({ children }) {
  const location = useLocation()

  // List of valid paths where Nav should be shown
  const validPaths = ['/', '/post_information']

  // Check if the current path is one of the valid paths
  const shouldShowNav = validPaths.includes(location.pathname)

  return (
    <>
      {shouldShowNav && <Nav />}
      <Suspense fallback={<div className='loadingDiv'></div>}>
        {children}
      </Suspense>
    </>
  )
}
