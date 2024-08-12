import React from 'react'
import { PiTelegramLogoThin } from 'react-icons/pi'
import { MdOutlineMailOutline } from 'react-icons/md'

export default function Footer () {
  return (
    <>
      <hr />

      <p className='i'>Contacts</p>
      <br />
      <p className='contacts'>
        <a
          className='contact'
          href='https://t.me/Kebalepile_1'
          target='_blank'
          rel='noopener noreferrer'
          title='https://t.me/Kebalepile_1'
        >
          <PiTelegramLogoThin />
        </a>
        <a
          className='contact'
          href='mailto:boitkongcommunity@gmail.com'
          title='boitkongcommunity@gmail.com'
        >
          <MdOutlineMailOutline />
        </a>
      </p>
      <br />
      <h6 className='i' style={{ color: 'gray' }}>
        © 2024 K.T Motshoana
      </h6>
    </>
  )
}
