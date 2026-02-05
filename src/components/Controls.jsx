import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import useGameStore from '../store/useGameStore';
import { hours, minutes, prepositions } from '../utils/timeUtils';

// Animations
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const fadeInUp = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.8);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
`;

const fadeOutDown = keyframes`
  0% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
  100% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.8);
  }
`;

const bounceIn = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0.3);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
  70% { 
    transform: scale(0.95);
  }
  100% { 
    transform: scale(1);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SentenceDisplay = styled.div`
  min-height: 36px;
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.3rem;
  box-shadow: 0 4px 6px ${props => props.theme.cardShadow};
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  width: 100%;

  @media (max-width: 480px) {
    min-height: 36px;
    padding: 0.3rem;
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
  }
`;

const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  max-height: 260px;

`;

const Section = styled.div`
  display: grid;
  gap: 0.2rem;
  width: 100%;
  margin-bottom: 0.1rem;
  flex: 1;
  align-content: stretch;
`;

const CategoryLabel = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme.subHeader};
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  font-weight: 600;
  display: none;
`;

const Button = styled.button`
  background: ${props => props.$error ? '#e74c3c' : props.theme.buttonBg};
  color: ${props => props.$error ? 'white' : props.theme.buttonText};
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.1s;
  box-shadow: 0 2px 0 ${props => props.$error ? '#c0392b' : props.theme.buttonShadow};
  min-height: 44px;
  
  /* Staggered animation based on index */
  opacity: 0;
  animation: ${props => props.$error
    ? css`${shake} 0.5s`
    : css`${fadeInUp} 0.4s ease-out forwards`};
  animation-delay: ${props => props.$delay || '0s'};

  @media (max-width: 400px) {
    padding: 0.4rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  &:hover {
    background: ${props => props.$error ? '#c0392b' : props.theme.buttonHover};
  }

  &:disabled {
    background: #bdc3c7;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

const Word = styled.span`
  background: ${props => props.theme.wordBg};
  color: ${props => props.theme.wordText};
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  animation: ${fadeInUp} 0.3s ease;
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  box-shadow: 0 4px 0 #1e8449;
  width: 100%;
  margin-top: 2rem;
  padding: 1.5rem;
  font-size: 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  animation: ${bounceIn} 0.6s ease-out;
  transition: all 0.2s;

  &:hover {
    background: #2ecc71;
    transform: scale(1.02);
  }

  &:active {
    transform: translateY(2px) scale(1);
    box-shadow: 0 2px 0 #1e8449;
  }
`;

const Feedback = styled.div`
  height: 20px;
  text-align: center;
  color: ${props => props.type === 'error' ? '#e74c3c' : '#27ae60'};
  font-weight: bold;
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.$error ? '#e74c3c' : props.theme.secondaryButtonBg};
  box-shadow: 0 4px 0 ${props => props.$error ? '#c0392b' : 'rgba(0,0,0,0.2)'};

  &:hover {
    background: ${props => props.$error ? '#c0392b' : props.theme.secondaryButtonHover};
  }
`;

const Controls = () => {
  const { userSentence, addWord, gameState, resetGame, currentTime } = useGameStore();
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger re-animation when new level starts (currentTime changes)
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentTime]);

  const handleWordClick = (word) => {
    if (gameState !== 'PLAYING') return;
    addWord(word);
  };

  const isError = gameState === 'ERROR';

  // All words for animation
  const prepositionWords = [...prepositions, "kvart", "halv"];
  const totalPrepositions = prepositionWords.length;

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

      <MainGrid>
        {gameState === 'WON' ? (
          <ActionButton onClick={resetGame}>Neste oppgave</ActionButton>
        ) : (
          <>
            {/* Prepositions & Specials */}
            <CategoryLabel>Ord</CategoryLabel>
            <Section style={{ gridTemplateColumns: 'repeat(4, 1fr)', flex: 1 }}>
              {prepositionWords.map((word, index) => (
                <SecondaryButton
                  key={`${animationKey}-${word}`}
                  onClick={() => handleWordClick(word)}
                  $error={isError}
                  $delay={`${index * 0.03}s`}
                >
                  {word}
                </SecondaryButton>
              ))}
            </Section>

            {/* Minutes / Numbers / Hours (1-12) */}
            <CategoryLabel>Tall / Timer</CategoryLabel>
            <Section style={{ gridTemplateColumns: 'repeat(4, 1fr)', flex: 3 }}>
              {hours.map((word, index) => (
                <Button
                  key={`${animationKey}-${word}`}
                  onClick={() => handleWordClick(word)}
                  $error={isError}
                  $delay={`${(totalPrepositions + index) * 0.03}s`}
                >
                  {word}
                </Button>
              ))}
            </Section>
          </>
        )}
      </MainGrid>
    </ControlsContainer>
  );
};

export default Controls;
