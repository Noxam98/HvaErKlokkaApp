import React from 'react';
import styled from 'styled-components';

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
                fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                transform={`rotate(0, ${posKvartOver.x}, ${posKvartOver.y})`}>
                <tspan x={posKvartOver.x} dy="-0.6em">KVART</tspan>
                <tspan x={posKvartOver.x} dy="1.2em">OVER</tspan>
            </text>

            {/* Halv (180 +/- w) */}
            <path d={describeSector(cx, cy, rInner, rOuter, 180 - markerW, 180 + markerW)} fill="#3498db" />
            <text x={posHalv.x} y={posHalv.y}
                fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                transform={`rotate(0, ${posHalv.x}, ${posHalv.y})`}>HALV</text>

            {/* Kvart På (270 +/- w) */}
            <path d={describeSector(cx, cy, rInner, rOuter, 270 - markerW, 270 + markerW)} fill="#3498db" />
            <text x={posKvartPa.x} y={posKvartPa.y}
                fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                transform={`rotate(0, ${posKvartPa.x}, ${posKvartPa.y})`}>
                <tspan x={posKvartPa.x} dy="-0.6em">KVART</tspan>
                <tspan x={posKvartPa.x} dy="1.2em">PÅ</tspan>
            </text>
        </StyledHintSVG>
    );
};

export default HintOverlay;
