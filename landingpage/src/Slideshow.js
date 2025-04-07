import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = ({ slides = [], autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [current, autoPlay, interval]);

  if (!slides.length) return null;

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          className={`slide ${index === current ? 'active' : ''}`}
          key={index}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            {slide.cta && (
              <a href={slide.cta.link} className="slide-btn">
                {slide.cta.text}
              </a>
            )}
          </div>
        </div>
      ))}

      <button className="prev" onClick={prevSlide}>
        ‹
      </button>
      <button className="next" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default Slideshow;
