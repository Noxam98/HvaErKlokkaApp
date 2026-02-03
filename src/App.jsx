import React, { useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Clock from './components/Clock';
import Controls from './components/Controls';
import useGameStore from './store/useGameStore';
import { lightTheme, darkTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    display: flex;
    justify-content: center;
    min-height: 100vh;
    transition: background 0.3s ease, color 0.3s ease;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0.5rem;
    height: 100vh;
    justify-content: center; /* Changed from space-evenly */
    gap: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.header};
  margin-bottom: 0;
  text-align: center;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
`;

const SubHeader = styled.p`
  color: ${props => props.theme.subHeader};
  margin-bottom: 2rem;
  text-align: center;
  transition: color 0.3s ease;
  
  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    margin-top: 0;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
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
  const { currentTime, initializeGame, correctPhrase, isDarkMode, toggleTheme } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ThemeToggle onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </ThemeToggle>
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
    </ThemeProvider>
  );
}

export default App;
