import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Clock from './components/Clock';
import Controls from './components/Controls';
import useGameStore from './store/useGameStore';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #f0f2f5;
    color: #333;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; /* Prevent horizontal scroll */

  @media (max-width: 480px) {
    padding: 1rem 0.5rem; /* Less padding on sides */
  }
`;

const Header = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SubHeader = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
`;

const DebugInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #eee;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #666;
  display: none; // Hidden by default, useful for verifying logic
`;

function App() {
  const { currentTime, initializeGame, correctPhrase } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>Lær Klokka</Header>
        <SubHeader>Hva er klokka på norsk?</SubHeader>

        <Clock hour={currentTime.hour} minute={currentTime.minute} />

        <Controls />

        {/* Uncomment to see correct answer for testing */}
        {/* <DebugInfo>
            Fasit: {correctPhrase.join(' ')}
        </DebugInfo> */}
      </AppContainer>
    </>
  );
}

export default App;
