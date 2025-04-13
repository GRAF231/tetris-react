import styled from 'styled-components';
import {
    PRIMARY,
    SECONDARY,
    MODAL_BACKGROUND,
    TEXT_PRIMARY,
    GRADIENTS,
} from '../../constants/colors';

// Анимации
const fadeIn = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const scaleIn = `
    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${MODAL_BACKGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
    ${fadeIn}
`;

export const ModalContent = styled.div`
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: scaleIn 0.4s ease-out;
    ${scaleIn}
`;

export const ModalHeader = styled.div`
    text-align: center;
`;

export const Title = styled.h2`
    font-size: 28px;
    margin: 0 0 8px 0;
    color: ${TEXT_PRIMARY};
    background: ${GRADIENTS.PRIMARY};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

export const ScoreContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background-color: #f8f8f8;
    border-radius: 8px;
`;

export const ScoreRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ScoreLabel = styled.div`
    font-size: 16px;
    color: ${TEXT_PRIMARY};
`;

export const ScoreValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${PRIMARY};
`;

export const HighScoreValue = styled.div<{ isNew: boolean }>`
    font-size: 24px;
    font-weight: 700;
    color: ${(props) => (props.isNew ? SECONDARY : PRIMARY)};
    display: flex;
    align-items: center;
    gap: 8px;

    &::after {
        content: '${(props) => (props.isNew ? '🏆' : '')}';
        font-size: 22px;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
`;

export const Button = styled.button<{ primary?: boolean }>`
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    ${(props) =>
        props.primary
            ? `
        background: ${GRADIENTS.PRIMARY};
        color: white;
        
        &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    `
            : `
        background-color: #f0f0f0;
        color: ${TEXT_PRIMARY};
        
        &:hover {
            background-color: #e8e8e8;
        }
        
        &:active {
            background-color: #ddd;
        }
    `}
`;

export const NewHighScoreLabel = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${SECONDARY};
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    background-color: rgba(255, 64, 129, 0.1);
    margin-top: -8px;
    animation: pulse 1.5s infinite;

    @keyframes pulse {
        0% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.7;
        }
    }
`;
