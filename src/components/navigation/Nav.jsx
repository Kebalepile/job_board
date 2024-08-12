import React, { useState } from 'react'
import { BiMenuAltLeft } from 'react-icons/bi'
import { FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt } from 'react-icons/fa' // Added icons
import { scrollIntoView } from '../../utils/functions'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import './navigation.css'

export default function Nav () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoLoaded] = useLoadingPlaceholder(1000)
  const [isMenuLoaded] = useLoadingPlaceholder(1200)
  const [isHomeLoaded] = useLoadingPlaceholder(1400)
  const [isAboutLoaded] = useLoadingPlaceholder(1600)
  const [isContactLoaded] = useLoadingPlaceholder(1800)
  const [isLoginLoaded] = useLoadingPlaceholder(2000)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className='menu'>
      <div className='hamburger' onClick={toggleMenu}>
        {!isMenuLoaded ? (
          <div className='placeholder placeholder-icon'></div>
        ) : (
          <BiMenuAltLeft className='icon' />
        )}
      </div>

      <div className='logo'>
        {!isLogoLoaded ? (
          <div className='placeholder placeholder-logo'></div>
        ) : (
          <img src='/assets/images/logo.png' alt='Logo' />
        )}
      </div>

      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => scrollIntoView('#home')}>
            {!isHomeLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Home
                <FaHome className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => scrollIntoView('#contact')}>
            {!isContactLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Contact <FaEnvelope className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => scrollIntoView('#login')}>
            {!isLoginLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Login
                <FaSignInAlt className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => scrollIntoView('#about')}>
            {!isAboutLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>About</>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}
