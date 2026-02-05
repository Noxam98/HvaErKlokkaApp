import React from 'react';
import styled from 'styled-components';
import { CLOCK_CONFIG } from './ClockConfig';

const StyledHintSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
  transform-origin: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: ${props => props.$show ? 1 : 0};
  /* Animation: start hidden under clock (scale 0.75), expand to full size */
  transform: ${props => props.$show ? `scale(${CLOCK_CONFIG.hintOverlay.scale})` : 'scale(0.75)'};
`;

const HintOverlay = ({ show }) => {
    const { innerRadius, outerRadius, textRadius, fontSize, markerFontSize } = CLOCK_CONFIG.hintOverlay;
    const cx = 50, cy = 50;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeSector = (x, y, innerR, outerR, startAngle, endAngle) => {
        const gap = 1.0;
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

    const getTextPos = (angle) => polarToCartesian(cx, cy, textRadius, angle);

    const posOver = getTextPos(45);
    const posPaHalv = getTextPos(135);
    const posOverHalv = getTextPos(225);
    const posPa = getTextPos(315);

    const posKvartOver = getTextPos(90);
    const posHalv = getTextPos(180);
    const posKvartPa = getTextPos(270);

    const markerW = 6;

    return (
        <StyledHintSVG
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            $show={show}
        >
            {/* === MAIN ZONES === */}
            <path d={describeSector(cx, cy, innerRadius, outerRadius, 0, 90 - markerW)} fill="rgba(46, 204, 113, 0.4)" />
            <text x={posOver.x} y={posOver.y} fill="#fff" fontSize={fontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(45, ${posOver.x}, ${posOver.y})`}>OVER</text>

            <path d={describeSector(cx, cy, innerRadius, outerRadius, 90 + markerW, 180 - markerW)} fill="rgba(241, 196, 15, 0.4)" />
            <text x={posPaHalv.x} y={posPaHalv.y} fill="#fff" fontSize={fontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(315, ${posPaHalv.x}, ${posPaHalv.y})`}>PÅ HALV</text>

            <path d={describeSector(cx, cy, innerRadius, outerRadius, 180 + markerW, 270 - markerW)} fill="rgba(230, 126, 34, 0.4)" />
            <text x={posOverHalv.x} y={posOverHalv.y} fill="#fff" fontSize={fontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(45, ${posOverHalv.x}, ${posOverHalv.y})`}>OVER HALV</text>

            <path d={describeSector(cx, cy, innerRadius, outerRadius, 270 + markerW, 360)} fill="rgba(231, 76, 60, 0.4)" />
            <text x={posPa.x} y={posPa.y} fill="#fff" fontSize={fontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(315, ${posPa.x}, ${posPa.y})`}>PÅ</text>

            {/* === MARKER ZONES === */}
            <path d={describeSector(cx, cy, innerRadius, outerRadius, 90 - markerW, 90 + markerW)} fill="#3498db" />
            <text x={posKvartOver.x} y={posKvartOver.y}
                fill="#fff" fontSize={markerFontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                <tspan x={posKvartOver.x} dy="-0.6em">KVART</tspan>
                <tspan x={posKvartOver.x} dy="1.2em">OVER</tspan>
            </text>

            <path d={describeSector(cx, cy, innerRadius, outerRadius, 180 - markerW, 180 + markerW)} fill="#3498db" />
            <text x={posHalv.x} y={posHalv.y}
                fill="#fff" fontSize={markerFontSize + 0.25} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">HALV</text>

            <path d={describeSector(cx, cy, innerRadius, outerRadius, 270 - markerW, 270 + markerW)} fill="#3498db" />
            <text x={posKvartPa.x} y={posKvartPa.y}
                fill="#fff" fontSize={markerFontSize} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                <tspan x={posKvartPa.x} dy="-0.6em">KVART</tspan>
                <tspan x={posKvartPa.x} dy="1.2em">PÅ</tspan>
            </text>
        </StyledHintSVG>
    );
};

export default HintOverlay;
