import styled, { keyframes } from 'styled-components';
import { GRADIENTS, PRIMARY, SECONDARY, TEXT_PRIMARY } from '../../constants/colors';

export const scoreIncreaseAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
`;

export const comboAnimation = keyframes`
    0% {
        transform: translateY(20px);
        opacity: 0;
    }
    20% {
        transform: translateY(0);
        opacity: 1;
    }
    80% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-20px);
        opacity: 0;
    }
`;

export const pointsPopupAnimation = keyframes`
    0% {
        transform: translateY(0) scale(0.8);
        opacity: 0;
    }
    20% {
        transform: translateY(-30px) scale(1.2);
        opacity: 1;
    }
    80% {
        transform: translateY(-60px) scale(1);
        opacity: 0.8;
    }
    100% {
        transform: translateY(-80px) scale(0.8);
        opacity: 0;
    }
`;

export const ScoreContainer = styled.div<{ $horizontal?: boolean }>`
    display: flex;
    flex-direction: ${(props) => (props.$horizontal ? 'row' : 'column')};
    gap: 8px;
    padding: ${(props) => (props.$horizontal ? '10px' : '16px')};
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    justify-content: space-between;

    @media (max-width: 767px) {
        padding: 10px;
        gap: 4px;
    }
`;

export const ScoreRow = styled.div<{ $horizontal?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${(props) =>
        props.$horizontal
            ? `
        flex-direction: column;
        flex: 1;
        text-align: center;
    `
            : ''}

    @media (max-width: 767px) {
        min-width: ${(props) => (props.$horizontal ? '80px' : 'auto')};
    }
`;

export const ScoreLabel = styled.div<{ $horizontal?: boolean }>`
    font-size: ${(props) => (props.$horizontal ? '12px' : '14px')};
    color: ${TEXT_PRIMARY};
    font-weight: 500;
    margin-bottom: ${(props) => (props.$horizontal ? '4px' : '0')};

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const ScoreValue = styled.div<{ $highlight?: boolean; $horizontal?: boolean }>`
    font-size: ${(props) => (props.$horizontal ? '20px' : '24px')};
    font-weight: 700;
    color: ${PRIMARY};
    transition: color 0.3s ease;
    animation: ${(props) => (props.$highlight ? scoreIncreaseAnimation : 'none')} 0.5s ease;

    @media (max-width: 767px) {
        font-size: ${(props) => (props.$horizontal ? '18px' : '20px')};
    }
`;

export const HighScoreValue = styled.div<{ $horizontal?: boolean }>`
    font-size: ${(props) => (props.$horizontal ? '16px' : '18px')};
    font-weight: 600;
    color: ${SECONDARY};

    @media (max-width: 767px) {
        font-size: ${(props) => (props.$horizontal ? '14px' : '16px')};
    }
`;

export const ComboContainer = styled.div<{ $horizontal?: boolean }>`
    display: flex;
    align-items: center;
    gap: ${(props) => (props.$horizontal ? '4px' : '8px')};
    margin-top: ${(props) => (props.$horizontal ? '0' : '8px')};
    flex-direction: ${(props) => (props.$horizontal ? 'column' : 'row')};
    flex: ${(props) => (props.$horizontal ? '1' : 'none')};
`;

export const ComboLabel = styled.div<{ $horizontal?: boolean }>`
    font-size: ${(props) => (props.$horizontal ? '12px' : '14px')};
    color: ${TEXT_PRIMARY};
    margin-bottom: ${(props) => (props.$horizontal ? '4px' : '0')};

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const ComboValue = styled.div<{ active: boolean; $horizontal?: boolean }>`
    font-size: ${(props) =>
        props.active ? (props.$horizontal ? '16px' : '18px') : props.$horizontal ? '12px' : '14px'};
    font-weight: ${(props) => (props.active ? '700' : '500')};
    color: ${(props) => (props.active ? SECONDARY : TEXT_PRIMARY)};
    opacity: ${(props) => (props.active ? 1 : 0.7)};

    @media (max-width: 767px) {
        font-size: ${(props) =>
            props.active
                ? props.$horizontal
                    ? '14px'
                    : '16px'
                : props.$horizontal
                  ? '10px'
                  : '12px'};
    }
`;

export const ComboText = styled.div<{ active: boolean; $horizontal?: boolean }>`
    position: ${(props) => (props.$horizontal ? 'static' : 'absolute')};
    bottom: ${(props) => (props.$horizontal ? 'auto' : '-30px')};
    right: ${(props) => (props.$horizontal ? 'auto' : '16px')};
    font-size: ${(props) => (props.$horizontal ? '12px' : '16px')};
    font-weight: 700;
    color: ${SECONDARY};
    background: ${GRADIENTS.SECONDARY};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${(props) => (props.active ? comboAnimation : 'none')} 2s ease-in-out;
    opacity: ${(props) => (props.$horizontal ? 1 : 0)};
    text-align: center;
    margin-top: ${(props) => (props.$horizontal ? '4px' : '0')};

    @media (max-width: 767px) {
        font-size: ${(props) => (props.$horizontal ? '10px' : '14px')};
    }
`;

export const PointsPopup = styled.div<{ show: boolean; x: number; y: number }>`
    position: fixed;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    transform: translate(-50%, -50%);
    font-size: 24px;
    font-weight: 700;
    color: white;
    background: ${GRADIENTS.SCORE};
    padding: 8px 16px;
    border-radius: 20px;
    pointer-events: none;
    z-index: 1000;
    opacity: ${(props) => (props.show ? 1 : 0)};
    animation: ${(props) => (props.show ? pointsPopupAnimation : 'none')} 0.8s ease-out forwards;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;
