import React from 'react';
import styled from 'styled-components';
import useGameStore from '../store/useGameStore';
import { hours, minutes, prepositions } from '../utils/timeUtils';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const SentenceDisplay = styled.div`
  min-height: 60px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;

  @media (max-width: 480px) {
    min-height: 50px;
    padding: 0.8rem;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const Word = styled.span`
  background: #ecf0f1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 #2980b9;

  @media (max-width: 400px) {
    padding: 0.8rem;
    font-size: 1rem;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #2980b9;
  }

  &:hover {
    background: #5dade2;
  }

  &:disabled {
    background: #bdc3c7;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionButton = styled(Button)`
  background: #27ae60;
  box-shadow: 0 4px 0 #2ecc71;
  grid-column: span 3;
  margin-top: 1rem;

  &:hover {
    background: #2ecc71;
  }
`;

const Feedback = styled.div`
  height: 20px;
  text-align: center;
  color: ${props => props.type === 'error' ? '#e74c3c' : '#27ae60'};
  font-weight: bold;
`;

const Controls = () => {
  const { userSentence, correctPhrase, addWord, gameState, resetGame } = useGameStore();

  const handleWordClick = (word) => {
    if (gameState !== 'PLAYING') return;
    addWord(word);
  };

  // Determine which options to show based on what we expect next
  // This is a heuristic to match the "Guided" feel
  const getOptions = () => {
    if (gameState === 'WON') return [];

    const nextIndex = userSentence.length;
    const expected = correctPhrase[nextIndex];

    if (!expected) return []; // Should be won

    // Logic:
    // If expected is a Preposition -> Show prepositions
    if (prepositions.includes(expected)) {
      return prepositions;
    }

    // If expected is "halv" -> Show "halv" and maybe hours/minutes as distractors?
    // Or if "halv" is the START (30 min), it's a "Minute" conceptually in this game logic?
    if (expected === 'halv') {
      // If it's the first word, mix with minutes
      if (nextIndex === 0) return minutes;
      // If it's after "på" or "over", user might expect an Hour next, but "halv" comes first.
      // Show "Only Halv"? Or Mix with Hours?
      // Let's mix with Hours to prevent just clicking the only option
      return ['halv', ...hours.slice(0, 5)]; // Randomized?
    }

    // If expected is a number/minute (start of sentence) -> Show minutes
    if (minutes.includes(expected) && nextIndex === 0) {
      return minutes;
    }

    // If expected is hour -> Show hours
    if (hours.includes(expected)) {
      return hours;
    }

    // Fallback: Show all unique relevant words?
    // Start with Minutes if empty
    if (nextIndex === 0) return minutes;

    // If we just picked a minute, usually Preposition follows

    // If we have nothing specific, just show what expected + checks
    // Simplest: Show the category of the Expected word + distractors from same category
    if (minutes.includes(expected)) return minutes;
    if (hours.includes(expected)) return hours;

    return hours; // Default
  };

  const currentOptions = getOptions();

  return (
    <ControlsContainer>
      <SentenceDisplay>
        {userSentence.length === 0 ? "Hva er klokka?" : userSentence.map((w, i) => (
          <Word key={i}>{w}</Word>
        ))}
      </SentenceDisplay>

      <Feedback type={gameState === 'ERROR' ? 'error' : 'success'}>
        {gameState === 'ERROR' && "Prøv igjen!"}
        {gameState === 'WON' && "Riktig!"}
      </Feedback>

      <OptionsGrid>
        {gameState === 'PLAYING' && currentOptions.map((word) => (
          <Button key={word} onClick={() => handleWordClick(word)}>
            {word}
          </Button>
        ))}

        {gameState === 'WON' && (
          <ActionButton onClick={resetGame}>Neste oppgave</ActionButton>
        )}
      </OptionsGrid>
    </ControlsContainer>
  );
};

export default Controls;
