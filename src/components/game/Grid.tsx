/**
 * Компонент игровой сетки
 */
import React, { FC, useRef, useCallback } from 'react';
import { Grid as GridType, Shape } from '../../types/game';
import { GridContainer, Cell, GhostShape, HighlightCell } from './Grid.styles';

interface LineHighlight {
    type: 'row' | 'column';
    index: number;
}

interface Props {
    grid: GridType;
    gridRef: React.RefObject<HTMLDivElement | null>;
    selectedShape: Shape | null;
    ghostPosition: { row: number; col: number; valid: boolean } | null;
    highlightedLines: LineHighlight[];
    onCellClick: (row: number, col: number, shape: Shape | null) => void;
}

export const Grid: FC<Props> = ({
    grid,
    gridRef,
    selectedShape,
    ghostPosition,
    highlightedLines,
    onCellClick,
}) => {
    const cellRefs = useRef<Record<string, HTMLElement | null>>({});

    const registerCellRef = useCallback(
        (row: number, col: number, element: HTMLDivElement | null) => {
            cellRefs.current[`${row}-${col}`] = element;
        },
        []
    );

    return (
        <GridContainer ref={gridRef}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        ref={(element) => registerCellRef(rowIndex, colIndex, element)}
                        $filled={cell.filled}
                        $color={cell.color}
                        $isHighlighted={
                            !!(
                                ghostPosition !== null &&
                                rowIndex >= ghostPosition.row &&
                                rowIndex <
                                    ghostPosition.row + (selectedShape?.matrix.length || 0) &&
                                colIndex >= ghostPosition.col &&
                                colIndex <
                                    ghostPosition.col + (selectedShape?.matrix[0]?.length || 0) &&
                                selectedShape?.matrix[rowIndex - ghostPosition.row]?.[
                                    colIndex - ghostPosition.col
                                ]
                            )
                        }
                        onClick={() => onCellClick(rowIndex, colIndex, selectedShape)}
                        data-row={rowIndex}
                        data-col={colIndex}
                    >
                        {ghostPosition !== null &&
                            rowIndex >= ghostPosition.row &&
                            rowIndex < ghostPosition.row + (selectedShape?.matrix.length || 0) &&
                            colIndex >= ghostPosition.col &&
                            colIndex <
                                ghostPosition.col + (selectedShape?.matrix[0]?.length || 0) &&
                            selectedShape?.matrix[rowIndex - ghostPosition.row]?.[
                                colIndex - ghostPosition.col
                            ] && <GhostShape valid={ghostPosition.valid} />}

                        {/* Подсветка ячейки, если она будет очищена */}
                        {highlightedLines.some(
                            (line) =>
                                (line.type === 'row' && line.index === rowIndex) ||
                                (line.type === 'column' && line.index === colIndex)
                        ) && <HighlightCell />}
                    </Cell>
                ))
            )}
        </GridContainer>
    );
};

export default Grid;
