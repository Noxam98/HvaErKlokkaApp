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
            streak: 0,
            bestStreak: 0,
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
                const { userSentence, correctPhrase, streak, bestStreak } = get();

                const nextIndex = userSentence.length;
                const expectedWord = correctPhrase[nextIndex];

                if (word === expectedWord) {
                    const newSentence = [...userSentence, word];
                    const isComplete = newSentence.length === correctPhrase.length;

                    let newStreak = streak;
                    let newBestStreak = bestStreak;
                    let isNewRecord = false;

                    if (isComplete) {
                        newStreak = streak + 1;

                        // Check for new best streak record
                        if (newStreak > bestStreak) {
                            newBestStreak = newStreak;
                            isNewRecord = true;
                        }
                    }

                    set({
                        userSentence: newSentence,
                        gameState: isComplete ? 'WON' : 'PLAYING',
                        streak: newStreak,
                        bestStreak: newBestStreak,
                        isNewRecord
                    });
                } else {
                    set({
                        gameState: 'ERROR',
                        streak: 0 // Reset streak on error
                    });
                    setTimeout(() => {
                        set(() => ({
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
                bestStreak: state.bestStreak
            }),
        }
    )
);

export default useGameStore;
