import React, { useState, useEffect } from 'react';
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder';
import { useNavigate } from 'react-router-dom';
import './home.css';
import imageUrls from '../../assets/agency_icons/imageUrls.json'; 
import About from '../about/About';
import Footer from '../footer/Footer';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded] = useLoadingPlaceholder(1000);
  const [isSliderContainerLoaded] = useLoadingPlaceholder(1000);

  const navigate = useNavigate();

  // Get image URLs from the JSON data
  const images = imageUrls.imageUrls;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = index => {
    setCurrentIndex(index);
  };

  const navigateToVacancies = () => {
    navigate('/vacancies');
  };

  return (
    <>
      {isSliderContainerLoaded ? (
        <div className='slider-container'>
          {isLoaded && images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt='Agency Icon'
                className='slide-image'
              />
              <p className='slider-message'>
                {/* Optionally, add a message or caption */}
              </p>
            </>
          ) : (
            <div className='placeholder loading-placeholder'></div>
          )}
          <div className='dots-container'>
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
          <button className='vacancies-button' onClick={navigateToVacancies}>
            View Vacancies
          </button>
        </div>
      ) : (
        <div className='placeholder slider-container-placeholder'></div>
      )}

      <About />
      <Footer />
    </>
  );
}
