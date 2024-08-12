import React, { useState, useEffect } from "react";
import useLoadingPlaceholder from "../../hooks/useLoadingPlaceholder";
import { useNavigate } from "react-router-dom";
import "./home.css";
import agencyData from "../../assets/agencyData.json"; // Import the JSON file

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded] = useLoadingPlaceholder(1000);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % agencyData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const navigateToVacancies = () => {
    navigate("/vacancies");
  };

  return (
    <div className="slider-container">
      {isLoaded && agencyData.length > 0 ? (
        <>
          <img
            src={agencyData[currentIndex].image}
            alt="Agency Icon"
            className="slide-image"
          />
          <p className="slider-message">
            {agencyData[currentIndex].message}
          </p>
        </>
      ) : (
        <div className="loading-placeholder">Loading...</div>
      )}
      <div className="dots-container">
        {agencyData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
      <button className="vacancies-button" onClick={navigateToVacancies}>
        View Vacancies
      </button>
    </div>
  );
}
