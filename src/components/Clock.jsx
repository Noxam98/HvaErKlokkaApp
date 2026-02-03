import React from 'react';
import styled from 'styled-components';

const ClockWrapper = styled.div`
  width: 300px;
  height: 300px;
  margin: 3rem auto; /* Increased margin for outside hints */
  perspective: 1000px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;

  @media (max-width: 380px) {
    transform: scale(0.75);
    margin: 1.5rem auto; /* Adjusted for scale */
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

const PivotButton = styled.button`
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

const AnalogFace = styled(ClockFace)`
  z-index: 2;
  transform: translateZ(10px); /* Push front face out */
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

const StyledHintSVG = styled.svg`
  position: absolute;
  top: -50px;
  left: -50px;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
  transform-origin: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); /* Elastic pop effect */
  opacity: ${props => props.$show ? 1 : 0};
  transform: ${props => props.$show ? 'scale(1)' : 'scale(0.7)'};
`;

const HintOverlay = ({ show }) => {
  const cx = 200, cy = 200;
  const rInner = 158; // Start just outside the clock (150px + border + padding)
  const rOuter = 195; // Outer edge of the hint ring
  const rText = 176;  // Center text in the ring

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Create a donut slice path
  const describeSector = (x, y, innerR, outerR, startAngle, endAngle) => {
    // Add gap
    const gap = 1.0; // Small visual gap between colored zones
    const start = startAngle + gap;
    const end = endAngle - gap;

    const startOuter = polarToCartesian(x, y, outerR, end);
    const endOuter = polarToCartesian(x, y, outerR, start);
    const startInner = polarToCartesian(x, y, innerR, end);
    const endInner = polarToCartesian(x, y, innerR, start);

    const largeArcFlag = end - start <= 180 ? "0" : "1";

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };

  // Helper for text positioning
  const getTextPos = (angle) => polarToCartesian(cx, cy, rText, angle);

  // Text Positions
  const posOver = getTextPos(45);
  const posPaHalv = getTextPos(135);
  const posOverHalv = getTextPos(225);
  const posPa = getTextPos(315);

  const posKvartOver = getTextPos(90);
  const posHalv = getTextPos(180);
  const posKvartPa = getTextPos(270);

  // Marker half-width in degrees
  const markerW = 6;

  return (
    <StyledHintSVG
      width="400" height="400" viewBox="0 0 400 400"
      $show={show}
    >
      {/* === MAIN ZONES === */}
      {/* Over: 0 -> 90-w */}
      <path d={describeSector(cx, cy, rInner, rOuter, 0, 90 - markerW)} fill="rgba(46, 204, 113, 0.4)" />
      <text x={posOver.x} y={posOver.y} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(45, ${posOver.x}, ${posOver.y})`}>OVER</text>

      {/* På Halv: 90+w -> 180-w */}
      <path d={describeSector(cx, cy, rInner, rOuter, 90 + markerW, 180 - markerW)} fill="rgba(241, 196, 15, 0.4)" />
      <text x={posPaHalv.x} y={posPaHalv.y} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(315, ${posPaHalv.x}, ${posPaHalv.y})`}>PÅ HALV</text>

      {/* Over Halv: 180+w -> 270-w */}
      <path d={describeSector(cx, cy, rInner, rOuter, 180 + markerW, 270 - markerW)} fill="rgba(230, 126, 34, 0.4)" />
      <text x={posOverHalv.x} y={posOverHalv.y} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(45, ${posOverHalv.x}, ${posOverHalv.y})`}>OVER HALV</text>

      {/* På: 270+w -> 360 */}
      <path d={describeSector(cx, cy, rInner, rOuter, 270 + markerW, 360)} fill="rgba(231, 76, 60, 0.4)" />
      <text x={posPa.x} y={posPa.y} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(315, ${posPa.x}, ${posPa.y})`}>PÅ</text>

      {/* === MARKER ZONES (Wedges) === */}
      {/* Kvart Over (90 +/- w) */}
      <path d={describeSector(cx, cy, rInner, rOuter, 90 - markerW, 90 + markerW)} fill="#3498db" />
      <text x={posKvartOver.x} y={posKvartOver.y}
        fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(0, ${posKvartOver.x}, ${posKvartOver.y})`}>KVART</text>

      {/* Halv (180 +/- w) */}
      <path d={describeSector(cx, cy, rInner, rOuter, 180 - markerW, 180 + markerW)} fill="#3498db" />
      <text x={posHalv.x} y={posHalv.y}
        fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(0, ${posHalv.x}, ${posHalv.y})`}>HALV</text>

      {/* Kvart På (270 +/- w) */}
      <path d={describeSector(cx, cy, rInner, rOuter, 270 - markerW, 270 + markerW)} fill="#3498db" />
      <text x={posKvartPa.x} y={posKvartPa.y}
        fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(0, ${posKvartPa.x}, ${posKvartPa.y})`}>KVART</text>
    </StyledHintSVG>
  );
};

const Clock = ({ hour, minute }) => {
  const [showDigital, setShowDigital] = React.useState(false);
  const [showHints, setShowHints] = React.useState(false);

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
    <ClockWrapper>
      {/* HintOverlay Moved Here - Static behind the flip card */}
      <HintOverlay show={showHints && !showDigital} />

      <div onClick={() => setShowDigital(!showDigital)} style={{ width: '100%', height: '100%' }}>
        <ClockInner $flipped={showDigital}>
          {thicknessLayers}

          <AnalogFace>
            {marks}
            {numbers}
            <HourHand angle={hourAngle} />
            <MinuteHand angle={minuteAngle} />
            {/* Interactive Pivot Button */}
            <PivotButton onClick={(e) => { e.stopPropagation(); setShowHints(!showHints); }}>
              💡
            </PivotButton>
          </AnalogFace>
          <DigitalFace>
            <DigitalDisplay>
              {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
            </DigitalDisplay>
          </DigitalFace>
        </ClockInner>
      </div>
    </ClockWrapper>
  );
};

export default Clock;
