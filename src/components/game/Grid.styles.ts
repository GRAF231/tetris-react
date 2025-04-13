import styled from 'styled-components';
import { GRID_BACKGROUND, GRID_BORDER } from '../../constants/colors';
import { GRID_SIZE } from '../../constants/gameConfig';

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(${GRID_SIZE}, 1fr);
    grid-template-rows: repeat(${GRID_SIZE}, 1fr);
    gap: 2px;
    background-color: ${GRID_BORDER};
    border: 2px solid ${GRID_BORDER};
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    user-select: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const Cell = styled.div<{ $filled: boolean; $color?: string; $isHighlighted: boolean }>`
    background-color: ${props => (props.$filled ? props.$color : GRID_BACKGROUND)};
    border-radius: 4px;
    transition: background-color 0.2s ease;
    aspect-ratio: 1 / 1;
    position: relative;
    cursor: ${props => (props.$isHighlighted ? 'pointer' : 'default')};
    
    ${props => props.$isHighlighted && `
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            pointer-events: none;
        }
    `}
    
    &.clearing {
        animation: clear-cell 0.5s forwards;
    }
    
    @keyframes clear-cell {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.8;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;

export const GhostShape = styled.div<{ valid: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: ${props => props.valid ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'};
    pointer-events: none;
    z-index: 2;
`;

export const LineHighlighter = styled.div<{ type: 'row' | 'column'; index: number }>`
    position: absolute;
    background-color: rgba(255, 255, 0, 0.3);
    z-index: 1;
    pointer-events: none;
    
    ${props => props.type === 'row' ? `
        top: ${(props.index * 100) / GRID_SIZE}%;
        left: 0;
        width: 100%;
        height: ${100 / GRID_SIZE}%;
    ` : `
        top: 0;
        left: ${(props.index * 100) / GRID_SIZE}%;
        width: ${100 / GRID_SIZE}%;
        height: 100%;
    `}
`;