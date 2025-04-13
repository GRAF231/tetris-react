import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Shape } from '../../types/game';

interface GhostShapeProps {
    shape: Shape | null;
    row: number;
    col: number;
    valid: boolean;
    cellSize?: number;
}

// Стили для компонента
const GhostContainer = styled.div<{ $row: number; $col: number; $valid: boolean }>`
    position: absolute;
    left: ${({ $col }) => $col * 100}%;
    top: ${({ $row }) => $row * 100}%;
    width: ${() => 100 / 8}%;
    height: ${() => 100 / 8}%;
    pointer-events: none;
    z-index: 10;
    transition: transform 0.1s ease-out;
`;

const GhostGridContainer = styled.div<{ $size: number }>`
    display: grid;
    grid-template-columns: repeat(${(props) => props.$size}, 1fr);
    grid-template-rows: repeat(${(props) => props.$size}, 1fr);
    width: 100%;
    height: 100%;
    transform: scale(${(props) => props.$size});
    transform-origin: top left;
`;

const GhostCell = styled.div<{ $filled: boolean; $valid: boolean }>`
    width: 100%;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: ${(props) =>
        props.$filled
            ? props.$valid
                ? 'rgba(0, 255, 0, 0.4)'
                : 'rgba(255, 0, 0, 0.4)'
            : 'transparent'};
    box-sizing: border-box;
`;

/**
 * Компонент для отображения "призрака" фигуры при перетаскивании
 */
export const GhostShape: FC<GhostShapeProps> = ({ shape, row, col, valid }) => {
    // Переменные для создания ячеек "призрака" фигуры
    const matrix = shape?.matrix || [];
    const matrixSize = shape ? matrix.length : 0;

    // Создаем ячейки для отображения "призрака" фигуры
    const ghostCells = useMemo(() => {
        if (!shape) return [];

        return matrix.flat().map((cell, index) => {
            const rowIdx = Math.floor(index / matrixSize);
            const colIdx = index % matrixSize;
            return (
                <GhostCell
                    key={`ghost-${rowIdx}-${colIdx}`}
                    $filled={cell}
                    $valid={valid}
                    style={{
                        gridRow: rowIdx + 1,
                        gridColumn: colIdx + 1,
                    }}
                />
            );
        });
    }, [shape, matrix, matrixSize, valid]);

    // Если нет фигуры или позиции, не рендерим ничего
    if (!shape) return null;

    return (
        <GhostContainer $row={row} $col={col} $valid={valid}>
            <GhostGridContainer $size={matrixSize}>{ghostCells}</GhostGridContainer>
        </GhostContainer>
    );
};

export default GhostShape;
