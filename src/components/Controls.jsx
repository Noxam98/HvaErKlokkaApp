import React from 'react';
import styled from 'styled-components';
import useGameStore from '../store/useGameStore';
import { hours, minutes, prepositions } from '../utils/timeUtils';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center children horizontally */
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SentenceDisplay = styled.div`
  min-height: 40px;
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px ${props => props.theme.cardShadow};
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    min-height: 40px;
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
`;

// ... Word ...

const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
`;

const Section = styled.div`
  display: grid;
  gap: 0.4rem;
  width: 100%;
  margin-bottom: 0.2rem;
`;

const CategoryLabel = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme.subHeader};
  margin-top: 0.2rem;
  margin-bottom: 0.1rem;
  font-weight: 600;
`;

const Button = styled.button`
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 0 ${props => props.theme.buttonShadow};

  @media (max-width: 400px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: none;
  }

  &:hover {
    background: ${props => props.theme.buttonHover};
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
  animation: fadeIn 0.3s ease;
  transition: all 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;



const ActionButton = styled(Button)`
  background: #27ae60;
  box-shadow: 0 4px 0 #2ecc71;
  width: 100%;
  margin-top: 2rem;
  padding: 1.5rem;
  font-size: 1.5rem;

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

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.secondaryButtonBg};
  box-shadow: 0 4px 0 rgba(0,0,0,0.2);

  &:hover {
    background: ${props => props.theme.secondaryButtonHover};
  }
`;

const Controls = () => {
  const { userSentence, userSelection, addWord, gameState, resetGame } = useGameStore();

  const handleWordClick = (word) => {
    if (gameState !== 'PLAYING') return;
    addWord(word);
  };

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
            <Section style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {/* Prepositions */}
              {prepositions.map(word => (
                <SecondaryButton key={word} onClick={() => handleWordClick(word)}>{word}</SecondaryButton>
              ))}
              {/* Specials */}
              {["kvart", "halv"].map(word => (
                <SecondaryButton key={word} onClick={() => handleWordClick(word)}>{word}</SecondaryButton>
              ))}
            </Section>

            {/* Minutes / Numbers / Hours (1-12) */}
            <CategoryLabel>Tall / Timer</CategoryLabel>
            <Section style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {hours.map(word => (
                <Button key={word} onClick={() => handleWordClick(word)}>{word}</Button>
              ))}
            </Section>
          </>
        )}
      </MainGrid>
    </ControlsContainer>
  );
};

export default Controls;
