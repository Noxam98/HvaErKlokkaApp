import React, { useState } from 'react';
import HintOverlay from './HintOverlay';
import {
    ClockWrapper,
    ClockInner,
    ThicknessLayer,
    AnalogFace,
    DigitalFace,
    PivotButton,
    Mark,
    ClockNumber,
    HourHand,
    MinuteHand,
    DigitalDisplay
} from './ClockStyles';

const Clock = ({ hour, minute }) => {
    const [showDigital, setShowDigital] = useState(false);
    const [showHints, setShowHints] = useState(false);

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
