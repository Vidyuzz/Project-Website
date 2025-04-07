import React from 'react';
import Slideshow from './Slideshow';

const slides = [
  {
    image: 'https://source.unsplash.com/1600x900/?technology',
    title: 'Welcome to the Future',
    description: 'Explore innovative solutions for a digital tomorrow.',
    cta: { text: 'Learn More', link: '#features' },
  },
  {
    image: 'https://source.unsplash.com/1600x900/?design',
    title: 'Design That Matters',
    description: 'Crafting modern experiences with sleek aesthetics.',
    cta: { text: 'Our Work', link: '#portfolio' },
  },
  {
    image: 'https://source.unsplash.com/1600x900/?business',
    title: 'Grow Your Brand',
    description: 'Let us help you make an impact where it counts.',
    cta: { text: 'Get Started', link: '#contact' },
  },
];

function App1() {
  return (
    <>
      <Slideshow slides={slides} autoPlay={true} interval={6000} />
    
    </>
  );
}

export default App1;
