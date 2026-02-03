import React from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 4px solid ${props => props.theme.clockBorder};
  background: ${props => props.theme.clockFace};
  position: relative;
  box-shadow: 0 10px 30px ${props => props.theme.cardShadow};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto; /* Reduced margin */
  flex-shrink: 0;
  flex-grow: 0;
  transform-origin: center center;
  transition: all 0.3s ease;

  @media (max-width: 380px) {
    transform: scale(0.75);
    margin: 0.5rem auto;
  }
  
  @media (max-width: 340px) {
    transform: scale(0.65);
    margin: 0 auto;
  }

  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: #c0392b; /* Constant red center pivot */
    border-radius: 50%;
    z-index: 10;
  }
`;

const Mark = styled.div`
  position: absolute;
  width: ${props => props.$isHour ? '6px' : '2px'};
  height: ${props => props.$isHour ? '15px' : '8px'};
  background: ${props => props.theme.clockMark};
  left: 50%;
  top: 0;
  transform-origin: 50% 146px; /* Center of 146px radius */
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  transition: background 0.3s ease;
`;

const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 5px;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

const HourHand = styled(Hand)`
  width: 8px;
  height: 70px;
  background: ${props => props.theme.clockHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 5;
`;

const MinuteHand = styled(Hand)`
  width: 4px;
  height: 110px;
  background: ${props => props.theme.clockMinuteHand}; /* Dark grey */
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
  color: ${props => props.theme.clockNumber};
  text-align: center;
  line-height: 30px;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  z-index: 10;
  transition: color 0.3s ease;
`;

const Clock = ({ hour, minute }) => {
  // Convert 12h to proper angle including minute offset
  const hourAngle = (hour % 12) * 30 + (minute / 2);
  const minuteAngle = minute * 6;

  const marks = [];
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;
    marks.push(<Mark key={i} angle={i * 6} $isHour={isHour} />);
  }

  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    // Radius for numbers. Max radius 146px.
    // Marks length 15px. End at 131px.
    // Number radius 115px -> Edge at 130px.
    const r = 115;
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
