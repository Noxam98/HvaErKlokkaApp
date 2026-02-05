import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import useGameStore from '../store/useGameStore';

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffb800;
  }
  50% { 
    box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffb800;
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.cardBg};
  padding: 0.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px ${props => props.theme.cardShadow};
  margin-bottom: 0;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  ${props => props.$newRecord && css`
    animation: ${glow} 1s ease-in-out 3;
    border: 2px solid #ffd700;
  `}
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:not(:last-child) {
    border-right: 1px solid ${props => props.theme.divider || 'rgba(128, 128, 128, 0.3)'};
    padding-right: 2rem;
  }
`;

const Label = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: ${props => props.theme.subHeader};
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  width: 100%;
`;

const Value = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.header};
  transition: transform 0.2s;

  ${props => props.$changed && css`
    animation: ${pop} 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  `}
`;

const StreakFire = styled.span`
  position: absolute;
  right: -1.5rem;
  opacity: ${props => props.$active ? 1 : 0};
  transition: opacity 0.3s;
`;

const RecordWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  position: relative;
`;

const RecordValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.2s;

  ${props => props.$isNew ? css`
    background: linear-gradient(90deg, #ffd700, #ffb800, #ffd700, #fff5cc, #ffd700);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shimmer} 0.8s linear 3, ${pop} 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  ` : css`
    color: ${props => props.theme.header};
  `}
`;

const NewRecordBadge = styled.span`
  font-size: 0.6rem;
  background: linear-gradient(135deg, #ffd700, #ffb800);
  color: #333;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 4px;
  font-weight: 700;
  text-transform: uppercase;
  animation: ${pop} 0.5s ease-out;
`;

const ScoreBoard = () => {
  const { streak, bestStreak, isNewRecord } = useGameStore();

  return (
    <BoardContainer $newRecord={isNewRecord}>
      <StatBox>
        <Label>Streak</Label>
        <RecordWrapper>
          <Value key={streak} $changed={true}>
            {streak}
          </Value>
          <StreakFire $active={streak > 2}>🔥</StreakFire>
        </RecordWrapper>
      </StatBox>
      <StatBox>
        <Label>🏆 Rekord</Label>
        <RecordWrapper>
          <RecordValue key={bestStreak} $isNew={isNewRecord}>
            {bestStreak}
          </RecordValue>
          {isNewRecord && <NewRecordBadge>Ny!</NewRecordBadge>}
        </RecordWrapper>
      </StatBox>
    </BoardContainer>
  );
};

export default ScoreBoard;
