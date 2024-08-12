import React from 'react'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import { FaTelegramPlane, FaEnvelope } from 'react-icons/fa'
import './footer.css' // Ensure the path to your CSS file is correct

export default function Footer () {
  const [isFooterLoaded] = useLoadingPlaceholder(1000)
  return (
    <>
      {isFooterLoaded ? (
        <div id='contact'>
          <hr />
          <p className='i'>Contacts</p>

          <p className='contacts'>
            <a
              className='contact'
              href='https://t.me/Kebalepile_1'
              target='_blank'
              rel='noopener noreferrer'
              title='https://t.me/Kebalepile_1'
            >
              <FaTelegramPlane />
            </a>
            <a
              className='contact'
              href='mailto:boitkongcommunity@gmail.com'
              title='boitkongcommunity@gmail.com'
            >
              <FaEnvelope />
            </a>
          </p>

          <h6 className='i'>© 2024 Boitekong Community Job Board</h6>
        </div>
      ) : (
        <div className='placeholder contact-placeholder'></div>
      )}
    </>
  )
}
