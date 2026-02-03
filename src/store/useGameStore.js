import { create } from 'zustand';
import { generateRandomTime, timeToNorwegianPhrase } from '../utils/timeUtils';

const useGameStore = create((set, get) => ({
    currentTime: generateRandomTime(),
    correctPhrase: [], // Array of correct words
    userSentence: [], // Array of words selected by user
    gameState: 'PLAYING', // PLAYING, WON, ERROR

    initializeGame: () => {
        const time = generateRandomTime();
        const phrase = timeToNorwegianPhrase(time.hour, time.minute);
        set({
            currentTime: time,
            correctPhrase: phrase,
            userSentence: [],
            gameState: 'PLAYING'
        });
    },

    addWord: (word) => {
        const { userSentence, correctPhrase } = get();
        // Optimistic checking or wait for full sentence?
        // User wants "input by choosing words from list... one by one".
        // We can verify step by step

        const nextIndex = userSentence.length;
        const expectedWord = correctPhrase[nextIndex];

        if (word === expectedWord) {
            const newSentence = [...userSentence, word];
            const isComplete = newSentence.length === correctPhrase.length;

            set({
                userSentence: newSentence,
                gameState: isComplete ? 'WON' : 'PLAYING'
            });
        } else {
            set({ gameState: 'ERROR' });
            // Optional: Shake effect or auto-reset after delay
            setTimeout(() => {
                set((state) => ({
                    // Only reset state if still in error (user might have clicked valid word?) 
                    // Actually simplified: Just flash error and keep previous valid state
                    gameState: 'PLAYING'
                }));
            }, 1000);
        }
    },

    resetGame: () => {
        get().initializeGame();
    }
}));

export default useGameStore;
