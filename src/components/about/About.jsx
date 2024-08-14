import React from 'react'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import './about.css'

export default function About () {
  const [isAboutLoaded] = useLoadingPlaceholder(1000)
  return (
    <>
      {isAboutLoaded ? (
        <div className='about-container'>
          <section id='about'>
            <h1>About Us</h1>
            <p>
              We&apos;re all about connecting you with job opportunities from
              various sectors. Our board features vacancies from:
            </p>
            <ul>
              <li>
                <strong>Public sector departments & entities</strong>
              </li>
              <li>
                <strong>Private sector companies</strong>
              </li>
              <li>
                <strong>Job posts from job agencies</strong>
              </li>
            </ul>
            <p>
              Whether you&apos;re a fresh graduate 🎓 or an experienced
              professional 👩‍💼👨‍💼, we&apos;re here to help you navigate your
              career path. Dive in and explore the multitude of opportunities
              waiting for you! 🚀💼
            </p>
          </section>
        </div>
      ) : (
        <div className='placeholder about-container-placeholder'></div>
      )}
    </>
  )
}
