import React, { FC } from 'react';
import styled from 'styled-components';

interface LineHighlighterProps {
    grid: Array<Array<{ filled: boolean; color?: string; id?: string }>>;
    highlightedLines: Array<{ type: 'row' | 'column'; index: number }>;
}

// Стили для компонента
const HighlightLine = styled.div<{
    $type: 'row' | 'column';
    $index: number;
    $gridSize: number;
}>`
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 5;
    pointer-events: none;
    animation: pulse 1s infinite alternate;

    ${({ $type, $index, $gridSize }) =>
        $type === 'row'
            ? `
        left: 0;
        width: 100%;
        top: ${($index / $gridSize) * 100}%;
        height: ${(1 / $gridSize) * 100}%;
    `
            : `
        top: 0;
        height: 100%;
        left: ${($index / $gridSize) * 100}%;
        width: ${(1 / $gridSize) * 100}%;
    `}

    @keyframes pulse {
        0% {
            opacity: 0.3;
        }
        100% {
            opacity: 0.7;
        }
    }
`;

/**
 * Компонент для подсветки линий, которые будут очищены
 */
export const LineHighlighter: FC<LineHighlighterProps> = ({ grid, highlightedLines }) => {
    if (!grid.length || !highlightedLines.length) return null;

    const gridSize = grid.length;

    return (
        <>
            {highlightedLines.map((line, index) => (
                <HighlightLine
                    key={`highlight-${line.type}-${line.index}-${index}`}
                    $type={line.type}
                    $index={line.index}
                    $gridSize={gridSize}
                />
            ))}
        </>
    );
};
export default LineHighlighter;
