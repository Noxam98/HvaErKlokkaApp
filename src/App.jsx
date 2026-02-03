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
  /* overflow-x: hidden; Removed to allow SVG overlap */

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0.5rem;
    min-height: 100vh; /* Ensure full height */
    justify-content: center;
    gap: 1rem;
    overflow-x: visible; /* Explicitly visible */
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

const HeaderControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 100;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  padding: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
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
  const { currentTime, initializeGame, correctPhrase, isDarkMode, toggleTheme } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <HeaderControls>
        <IconButton onClick={toggleFullscreen} title="Fullskjerm">
          ⛶
        </IconButton>
        <IconButton onClick={toggleTheme} title="Bytt tema">
          {isDarkMode ? '☀️' : '🌙'}
        </IconButton>
      </HeaderControls>
      <AppContainer>
        <Header>Hva er klokka på norsk?</Header>

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
