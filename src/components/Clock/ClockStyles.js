import styled from 'styled-components';
import { CLOCK_CONFIG } from './ClockConfig';

// Clock uses container queries - container sets the size
export const ClockWrapper = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  perspective: 1000px;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  overflow: visible; /* Allow hint overlay to extend beyond */
  container-type: inline-size;
  container-name: clock;
`;

export const ClockInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${props => props.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

export const ClockFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${CLOCK_CONFIG.face.borderWidth} solid ${props => props.theme.clockBorder};
  background: ${props => props.theme.clockFace};
  box-shadow: 0 10px 30px ${props => props.theme.cardShadow};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PivotButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${CLOCK_CONFIG.pivot.size};
  height: ${CLOCK_CONFIG.pivot.size};
  border-radius: 50%;
  background: #c0392b;
  border: 2px solid #fff; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 20;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: ${CLOCK_CONFIG.pivot.fontSize};
  transition: transform 0.2s;

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

export const AnalogFace = styled(ClockFace)`
  z-index: 2;
  transform: translateZ(10px);
`;

export const DigitalFace = styled(ClockFace)`
  transform: rotateY(180deg) translateZ(10px);
  z-index: 1;
`;

export const ThicknessLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.theme.clockBorder};
  transform-style: preserve-3d;
  pointer-events: none;
`;

export const DigitalDisplay = styled.div`
  font-size: ${CLOCK_CONFIG.digital.fontSize};
  font-weight: 700;
  color: ${props => props.theme.clockNumber};
  font-family: 'Courier New', Courier, monospace;
`;

// Mark positioning - radius controls distance from center
// radius 47 = at edge, radius 40 = more toward center
export const Mark = styled.div`
  position: absolute;
  width: ${props => props.$isHour ? CLOCK_CONFIG.marks.hourWidth : CLOCK_CONFIG.marks.minuteWidth};
  height: ${props => props.$isHour ? CLOCK_CONFIG.marks.hourHeight : CLOCK_CONFIG.marks.minuteHeight};
  background: ${props => props.theme.clockMark};
  left: 50%;
  top: ${50 - CLOCK_CONFIG.marks.radius}%;
  transform-origin: 50% ${props => {
    const height = props.$isHour ? 5 : 2.7; // height percentages
    const radius = CLOCK_CONFIG.marks.radius;
    // Calculate: distance from top of mark to center = radius / height
    return (radius / height * 100) + '%';
  }};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  transition: background 0.3s ease;
`;

export const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 1cqw;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

export const HourHand = styled(Hand)`
  width: ${CLOCK_CONFIG.hourHand.width};
  height: ${CLOCK_CONFIG.hourHand.height};
  background: ${props => props.theme.clockHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 5;
`;

export const MinuteHand = styled(Hand)`
  width: ${CLOCK_CONFIG.minuteHand.width};
  height: ${CLOCK_CONFIG.minuteHand.height};
  background: ${props => props.theme.clockMinuteHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 6;
`;

export const ClockNumber = styled.div`
  position: absolute;
  width: ${CLOCK_CONFIG.numbers.size};
  height: ${CLOCK_CONFIG.numbers.size};
  left: 50%;
  top: 50%;
  margin-left: calc(-1 * ${CLOCK_CONFIG.numbers.size} / 2);
  margin-top: calc(-1 * ${CLOCK_CONFIG.numbers.size} / 2);
  font-size: ${CLOCK_CONFIG.numbers.fontSize};
  font-weight: 600;
  color: ${props => props.theme.clockNumber};
  text-align: center;
  line-height: ${CLOCK_CONFIG.numbers.size};
  transform: translate(${props => props.x}%, ${props => props.y}%);
  z-index: 10;
  transition: color 0.3s ease;
`;
