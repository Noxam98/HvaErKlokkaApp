import React from 'react';
import styled from 'styled-components';

const ClockWrapper = styled.div`
  width: 300px;
  height: 300px;
  margin: 1rem auto;
  perspective: 1000px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;

  @media (max-width: 380px) {
    transform: scale(0.75);
    margin: 0.5rem auto;
  }
  
  @media (max-width: 340px) {
    transform: scale(0.65);
    margin: 0 auto;
  }
`;

const ClockInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${props => props.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const ClockFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid ${props => props.theme.clockBorder};
  background: ${props => props.theme.clockFace};
  box-shadow: 0 10px 30px ${props => props.theme.cardShadow};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnalogFace = styled(ClockFace)`
  z-index: 2;
  transform: translateZ(10px); /* Push front face out */

  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: #c0392b; /* Red center pivot */
    border-radius: 50%;
    z-index: 10;
  }
`;

const DigitalFace = styled(ClockFace)`
  transform: rotateY(180deg) translateZ(10px); /* Push back face out */
  z-index: 1;
`;

const ThicknessLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.theme.clockBorder};
  transform-style: preserve-3d;
  pointer-events: none; /* Let clicks pass through */
`;

const DigitalDisplay = styled.div`
  font-size: 5rem;
  font-weight: 700;
  color: ${props => props.theme.clockNumber};
  font-family: 'Courier New', Courier, monospace;
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
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

const MinuteHand = styled(Hand)`
  width: 4px;
  height: 110px;
  background: ${props => props.theme.clockMinuteHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 6;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
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
  const [showDigital, setShowDigital] = React.useState(false);

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

  // Generate thickness layers to simulate volume
  const thicknessLayers = [];
  for (let z = -9; z < 10; z += 1) {
    thicknessLayers.push(<ThicknessLayer key={z} style={{ transform: `translateZ(${z}px)` }} />);
  }

  return (
    <ClockWrapper onClick={() => setShowDigital(!showDigital)}>
      <ClockInner $flipped={showDigital}>
        {thicknessLayers}
        <AnalogFace>
          {marks}
          {numbers}
          <HourHand angle={hourAngle} />
          <MinuteHand angle={minuteAngle} />
        </AnalogFace>
        <DigitalFace>
          <DigitalDisplay>
            {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
          </DigitalDisplay>
        </DigitalFace>
      </ClockInner>
    </ClockWrapper>
  );
};

export default Clock;
