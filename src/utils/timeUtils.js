export const generateRandomTime = () => {
    // Generate time in 5-minute intervals to make it easier for learning
    const hour = Math.floor(Math.random() * 12) + 1; // 1-12
    const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10 ... 55
    return { hour, minute };
};

export const hours = [
    "ett", "to", "tre", "fire", "fem", "seks", "sju", "åtte", "ni", "ti", "elleve", "tolv"
];

// Minutes user can select (as words)
export const minutes = [
    "fem", "ti", "kvart", "tjue", "halv"
];

export const prepositions = ["over", "på"];

const numbers = {
    0: "null",
    5: "fem",
    10: "ti",
    15: "kvart",
    20: "tjue",
    25: "fem", // "fem" på halv
    30: "halv",
    35: "fem", // "fem" over halv
    40: "ti", // "ti" over halv (or tjue?) Let's check logic below
    45: "kvart",
    50: "ti",
    55: "fem"
};

export const timeToNorwegianPhrase = (hour, minute) => {
    // Returns an array of strings forming the correct sentence.
    // Example: 10:10 -> ["ti", "over", "ti"]
    // Example: 08:20 -> ["ti", "på", "halv", "ni"]

    let nextHour = hour + 1;
    if (nextHour > 12) nextHour = 1;

    const hStr = hours[hour - 1];
    const nextHStr = hours[nextHour - 1];

    if (minute === 0) {
        // 8:00 -> "åtte" (or "klokka er åtte"?) usually just the number for the clock face.
        // User might expect "klokka er..." but let's stick to the core time.
        return [hStr];
    }

    // 1-20: [Min] over [Hour]
    if (minute <= 20) {
        let mStr = numbers[minute] || minute.toString();
        if (minute === 15) mStr = "kvart";
        else if (minute === 20) mStr = "ti"; // Wait, 20 is "ti på halv" ?? 
        // Usually: 
        // 5 over
        // 10 over
        // kvart over
        // 20: "ti på halv" (Most common in daily speech) OR "tjue over" (Simpler).
        // Let's implement the "Classic/Hard" way as it's for learning.
        if (minute === 20) {
            return ["ti", "på", "halv", nextHStr];
        }
        return [mStr, "over", hStr];
    }

    // 21-30: relative to half next hour
    // 8:25 -> fem på halv ni
    if (minute < 30) {
        const diff = 30 - minute;
        // 25 -> 5
        const mStr = numbers[diff] || diff.toString();
        return [mStr, "på", "halv", nextHStr];
    }

    // 30: halv [NextHour]
    if (minute === 30) {
        return ["halv", nextHStr];
    }

    // 31-40: relative to half next hour (past half)
    // 8:35 -> fem over halv ni
    if (minute <= 40) {
        // 8:40 -> ti over halv ni
        const diff = minute - 30;
        const mStr = numbers[diff] || diff.toString();
        return [mStr, "over", "halv", nextHStr];
    }

    // 41-59: relative to next hour (to)
    // 8:45 -> kvart på ni
    // 8:50 -> ti på ni
    // 8:55 -> fem på ni
    {
        const diff = 60 - minute;
        let mStr = numbers[diff] || diff.toString();
        if (diff === 15) mStr = "kvart";
        return [mStr, "på", nextHStr];
    }
};

// Helper to get options for the UI
export const getAvailableWords = () => {
    // Unique list of all potential words
    return [
        "ett", "to", "tre", "fire", "fem", "seks", "sju", "åtte", "ni", "ti", "elleve", "tolv",
        "kvart", "halv", "tjue", "over", "på"
    ];
};
