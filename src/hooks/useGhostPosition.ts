import { useState, useEffect, useRef } from 'react';
import { Shape } from '../types/game';
import { canPlaceShape } from '../core/gameLogic';

export interface GhostPosition {
    row: number;
    col: number;
    valid: boolean;
}

interface HighlightedLine {
    type: 'row' | 'column';
    index: number;
}

interface UseGhostPositionProps {
    grid: Array<Array<{ filled: boolean; color?: string; id?: string }>>;
    selectedShape: Shape | null;
}

/**
 * Хук для управления положением "призрака" фигуры и подсветкой линий
 */
export function useGhostPosition({ grid, selectedShape }: UseGhostPositionProps) {
    const [ghostPosition, setGhostPosition] = useState<GhostPosition | null>(null);
    const [highlightedLines, setHighlightedLines] = useState<HighlightedLine[]>([]);
    const lastGhostPositionRef = useRef<GhostPosition | null>(null);

    // Сохраняем последнюю валидную позицию "призрака"
    useEffect(() => {
        if (ghostPosition) {
            lastGhostPositionRef.current = ghostPosition;
        }
    }, [ghostPosition]);

    /**
     * Обновляет позицию "призрака" фигуры и подсвеченные линии
     */
    const updateGhostPosition = (row: number, col: number, shape: Shape | null = selectedShape) => {
        if (!shape || !grid || !grid.length) {
            setGhostPosition(null);
            setHighlightedLines([]);
            return;
        }

        const check = canPlaceShape(grid, shape, row, col);

        const newGhostPosition = {
            row,
            col,
            valid: check.valid,
        };

        setGhostPosition(newGhostPosition);

        if (check.valid && check.linesWillBeFilled) {
            const lines = [
                ...check.linesWillBeFilled.rows.map((index) => ({
                    type: 'row' as const,
                    index,
                })),
                ...check.linesWillBeFilled.cols.map((index) => ({
                    type: 'column' as const,
                    index,
                })),
            ];
            setHighlightedLines(lines);
        } else {
            setHighlightedLines([]);
        }

        return {
            ghostPosition: newGhostPosition,
            valid: check.valid,
            linesWillBeFilled: check.linesWillBeFilled,
        };
    };

    /**
     * Сбрасывает позицию "призрака" и подсвеченные линии
     */
    const resetGhostPosition = () => {
        setGhostPosition(null);
        setHighlightedLines([]);
    };

    /**
     * Возвращает последнюю сохраненную позицию "призрака"
     */
    const getLastGhostPosition = () => {
        return lastGhostPositionRef.current;
    };

    return {
        ghostPosition,
        highlightedLines,
        updateGhostPosition,
        resetGhostPosition,
        getLastGhostPosition,
    };
}
