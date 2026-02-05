// =====================================================
// CLOCK CONFIGURATION CONSTANTS
// All sizing values in one place for easy customization
// Units: cqw = container query width (scales with clock size)
// =====================================================

export const CLOCK_CONFIG = {
    // === Numbers (1-12) ===
    numbers: {
        radius: 380,        // Distance from center (percentage for transform)
        size: '10cqw',      // Width/height of number container
        fontSize: '5cqw',   // Font size
    },

    // === Clock hands ===
    hourHand: {
        width: '1.5cqw',
        height: '25%',
    },
    minuteHand: {
        width: '1.3cqw',
        height: '34%',
    },

    // === Tick marks ===
    marks: {
        radius: 50,                   // Distance from center in % (47 = edge, 40 = inward)
        hourWidth: '1.2cqw',            // Width of hour marks (12, 3, 6, 9)
        hourHeight: '5%',             // Height of hour marks
        minuteWidth: '0.7cqw',        // Width of minute marks
        minuteHeight: '2.7%',         // Height of minute marks
    },

    // === Center pivot button ===
    pivot: {
        size: '8cqw',
        fontSize: '4cqw',
    },

    // === Digital display ===
    digital: {
        fontSize: '17cqw',
    },

    // === Clock face ===
    face: {
        borderWidth: '4px',
        padding: '20px',          // Padding around clock for hint overlay
    },
    // === Hint overlay (colored ring with time phrases) ===
    hintOverlay: {
        scale: 1,              // Scale when visible (1.33 = 33% larger than clock)
        innerRadius: 52,        // Inner edge of ring (just outside clock face)
        outerRadius: 60,          // Outer edge of ring
        textRadius: 56,         // Where text is positioned
        fontSize: 5,           // Main zone text size
        markerFontSize: 2.5,     // Marker zone text size (kvart over/på)
    },
};

export default CLOCK_CONFIG;
