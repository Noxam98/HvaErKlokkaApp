import React, { useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import confetti from 'canvas-confetti';
import { FaTelegram, FaEnvelope, FaExpand, FaSun, FaMoon } from 'react-icons/fa';
import Clock from './components/Clock';
import Controls from './components/Controls';
import ScoreBoard from './components/ScoreBoard';
import useGameStore from './store/useGameStore';
import { lightTheme, darkTheme } from './theme';
import { CLOCK_CONFIG } from './components/Clock/ClockConfig';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    min-height: 100vh;
    transition: background 0.3s ease, color 0.3s ease;
  }
  
  #root {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

/* Header with contacts, buttons, and scoreboard */
const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.cardBg};
  box-shadow: 0 2px 8px ${props => props.theme.cardShadow};
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.3rem 0.5rem;
  }
`;

const HeaderSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  flex: 1;
  
  &:last-child {
    align-items: flex-end;
  }
`;

const ContactIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ContactLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconLink = styled.a`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-size: 1.8rem;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  padding: 0.3rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

/* Main layout */
const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  /* Desktop: horizontal layout */
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    justify-content: flex-start;
    gap: 0.5rem;
  }
`;

const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: ${CLOCK_CONFIG.face.padding};
  
  /* Clock container size (includes padding) */
  width: calc(300px + ${CLOCK_CONFIG.face.padding} * 2);
  height: calc(300px + ${CLOCK_CONFIG.face.padding} * 2);

  @media (min-width: 1024px) {
    width: calc(400px + ${CLOCK_CONFIG.face.padding} * 2);
    height: calc(400px + ${CLOCK_CONFIG.face.padding} * 2);
  }
  
  @media (max-width: 380px) {
    width: calc(240px + ${CLOCK_CONFIG.face.padding} * 2);
    height: calc(240px + ${CLOCK_CONFIG.face.padding} * 2);
  }
  
  @media (max-width: 340px) {
    width: calc(200px + ${CLOCK_CONFIG.face.padding} * 2);
    height: calc(200px + ${CLOCK_CONFIG.face.padding} * 2);
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 768px) {
    flex: 1;
    min-height: 0;
    max-width: 100%;
  }
`;

function App() {
  const { currentTime, initializeGame, isDarkMode, toggleTheme, gameState } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState === 'WON') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameState]);

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
      <Header>
        <HeaderSide>
          <ContactLabel>Kontakt:</ContactLabel>
          <ContactIcons>
            <IconLink href="https://t.me/progtt" target="_blank" rel="noopener noreferrer" title="Telegram: @progtt">
              <FaTelegram />
            </IconLink>
            <IconLink href="mailto:meliqq98@gmail.com" title="Email: meliqq98@gmail.com">
              <FaEnvelope />
            </IconLink>
          </ContactIcons>
        </HeaderSide>

        <HeaderCenter>
          <ScoreBoard />
        </HeaderCenter>

        <HeaderSide>
          <IconButton onClick={toggleFullscreen} title="Fullskjerm">
            <FaExpand />
          </IconButton>
          <IconButton onClick={toggleTheme} title="Bytt tema">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </IconButton>
        </HeaderSide>
      </Header>

      <AppContainer>
        <ClockWrapper>
          <Clock hour={currentTime.hour} minute={currentTime.minute} />
        </ClockWrapper>

        <ControlsWrapper>
          <Controls />
        </ControlsWrapper>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
