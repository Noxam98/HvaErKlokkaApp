import styled from 'styled-components';

export const ClockWrapper = styled.div`
  width: 300px;
  height: 300px;
  margin: 0 auto; /* No top/bottom margin */
  perspective: 1000px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;

  @media (max-width: 380px) {
    transform: scale(0.75);
    margin: 0.2rem auto; /* Adjusted for scale */
  }
  
  @media (max-width: 340px) {
    transform: scale(0.65);
    margin: 0 auto;
  }
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
  border: 4px solid ${props => props.theme.clockBorder};
  background: ${props => props.theme.clockFace};
  box-shadow: 0 10px 30px ${props => props.theme.cardShadow};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PivotButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
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
  font-size: 12px;
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
  transform: translateZ(10px); /* Push front face out */
`;

export const DigitalFace = styled(ClockFace)`
  transform: rotateY(180deg) translateZ(10px); /* Push back face out */
  z-index: 1;
`;

export const ThicknessLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.theme.clockBorder};
  transform-style: preserve-3d;
  pointer-events: none; /* Let clicks pass through */
`;

export const DigitalDisplay = styled.div`
  font-size: 5rem;
  font-weight: 700;
  color: ${props => props.theme.clockNumber};
  font-family: 'Courier New', Courier, monospace;
`;

export const Mark = styled.div`
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

export const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 5px;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

export const HourHand = styled(Hand)`
  width: 8px;
  height: 70px;
  background: ${props => props.theme.clockHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 5;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

export const MinuteHand = styled(Hand)`
  width: 4px;
  height: 110px;
  background: ${props => props.theme.clockMinuteHand};
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  z-index: 6;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44), background 0.3s ease;
`;

export const ClockNumber = styled.div`
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
