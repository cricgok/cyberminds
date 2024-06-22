import React, { useState } from 'react';
import styled from 'styled-components';
import sliderImage from '../assets/images/slider.png'; // Adjust the path to your image

const Slider = ({ setLeftPanelWidth, leftPanelWidth }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newWidth = e.clientX;
    setLeftPanelWidth(newWidth);
  };

  return (
    <SliderContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Ensure dragging stops if mouse leaves container
    >
      <Thumb
        onMouseDown={handleMouseDown}
      >
        <img src={sliderImage} alt="Slider" />
      </Thumb>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  position: relative;
  width: 10px;
  height: 100%;
  background-color: #ccc;
  cursor: ew-resize;
`;

const Thumb = styled.div`
  position: absolute;
  width: 20px;
  height: 10%;
  position: relative;
  top: 40%;
  left:20px;
  right: 10px;

  left: 50%;
  transform: translateX(-50%);
  img {
    width: 100%;
    height: 100%;
  }
`;

export default Slider;
