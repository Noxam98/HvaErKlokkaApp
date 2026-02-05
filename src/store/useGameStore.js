import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateRandomTime, timeToNorwegianPhrase } from '../utils/timeUtils';

const useGameStore = create(
    persist(
        (set, get) => ({
            currentTime: generateRandomTime(),
            correctPhrase: [], // Array of correct words
            userSentence: [], // Array of words selected by user
            gameState: 'PLAYING', // PLAYING, WON, ERROR
            isDarkMode: false,
            score: 0,
            streak: 0,
            highScore: 0,
            isNewRecord: false,

            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

            initializeGame: () => {
                const time = generateRandomTime();
                const phrase = timeToNorwegianPhrase(time.hour, time.minute);
                set({
                    currentTime: time,
                    correctPhrase: phrase,
                    userSentence: [],
                    gameState: 'PLAYING',
                    isNewRecord: false
                });
            },

            addWord: (word) => {
                const { userSentence, correctPhrase, streak, score, highScore } = get();
                // Optimistic checking or wait for full sentence?
                // User wants "input by choosing words from list... one by one".
                // We can verify step by step

                const nextIndex = userSentence.length;
                const expectedWord = correctPhrase[nextIndex];

                if (word === expectedWord) {
                    const newSentence = [...userSentence, word];
                    const isComplete = newSentence.length === correctPhrase.length;

                    let newScore = score;
                    let newStreak = streak;
                    let newHighScore = highScore;
                    let isNewRecord = false;

                    if (isComplete) {
                        newStreak = streak + 1;
                        // Base points 100 + Streak bonus (10 * streak)
                        newScore = score + 100 + (newStreak * 10);

                        // Check for new high score
                        if (newScore > highScore) {
                            newHighScore = newScore;
                            isNewRecord = true;
                        }
                    }

                    set({
                        userSentence: newSentence,
                        gameState: isComplete ? 'WON' : 'PLAYING',
                        score: newScore,
                        streak: newStreak,
                        highScore: newHighScore,
                        isNewRecord
                    });
                } else {
                    set({
                        gameState: 'ERROR',
                        streak: 0 // Reset streak on error
                    });
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
        }),
        {
            name: 'olha-klokker-storage',
            partialize: (state) => ({
                isDarkMode: state.isDarkMode,
                score: state.score,
                streak: state.streak,
                highScore: state.highScore
            }),
        }
    )
);

export default useGameStore;
