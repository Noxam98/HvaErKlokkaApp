import React from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 10px solid #2c3e50;
  background: #ecf0f1;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  flex-shrink: 0; /* Prevent squashing */
  transition: transform 0.3s ease;

  @media (max-width: 380px) {
    transform: scale(0.85);
    margin: 1rem auto;
  }
  
  @media (max-width: 320px) {
    transform: scale(0.75);
    margin: 0.5rem auto;
  }

  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: #c0392b;
    border-radius: 50%;
    z-index: 10;
  }
`;

const Mark = styled.div`
  position: absolute;
  width: ${props => props.isHour ? '6px' : '2px'};
  height: ${props => props.isHour ? '15px' : '8px'};
  background: #7f8c8d;
  left: 50%;
  top: 10px;
  transform-origin: 50% 140px; /* 150px - 10px offset */
  transform: translateX(-50%) rotate(${props => props.angle}deg);
`;

const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 5px;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
`;

const HourHand = styled(Hand)`
  width: 8px;
  height: 70px;
  background: #2c3e50;
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 5;
`;

const MinuteHand = styled(Hand)`
  width: 4px;
  height: 110px;
  background: #34495e; /* Dark grey */
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 6;
`;

const ClockNumber = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  top: 50%;
  margin-left: -15px; /* Half of width */
  margin-top: -15px;  /* Half of height */
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  line-height: 30px;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  z-index: 10;
`;

const Clock = ({ hour, minute }) => {
  // Convert 12h to proper angle including minute offset
  const hourAngle = (hour % 12) * 30 + (minute / 2);
  const minuteAngle = minute * 6;

  const marks = [];
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;
    marks.push(<Mark key={i} angle={i * 6} isHour={isHour} />);
  }

  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    // Radius for numbers (Clock is 300px, radius 150px. Marks are at edge. Numbers inside marks)
    // Marks top is 10px, len 15px. Inner radius ~125px.
    const r = 110;
    const rad = (i * 30) * (Math.PI / 180);
    const x = r * Math.sin(rad);
    const y = -r * Math.cos(rad);

    numbers.push(
      <ClockNumber key={i} x={x} y={y}>
        {i}
      </ClockNumber>
    );
  }

  return (
    <ClockContainer>
      {marks}
      {numbers}
      <HourHand angle={hourAngle} />
      <MinuteHand angle={minuteAngle} />
    </ClockContainer>
  );
};

export default Clock;
