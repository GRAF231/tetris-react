/**
 * Компонент игровой сетки
 */
import React, { FC, useRef, useCallback } from 'react';
import { Grid as GridType, Shape } from '../../types/game';
import {
    GridContainer,
    Cell,
    GhostShape,
    LineHighlighter
} from './Grid.styles';

interface LineHighlight {
    type: 'row' | 'column';
    index: number;
}

interface Props {
    grid: GridType;
    selectedShape: Shape | null;
    ghostPosition: { row: number; col: number; valid: boolean } | null;
    highlightedLines: LineHighlight[];
    onCellClick: (row: number, col: number) => void;
}

export const Grid: FC<Props> = ({
    grid,
    selectedShape,
    ghostPosition,
    highlightedLines,
    onCellClick
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<Record<string, HTMLElement | null>>({});
    
    const registerCellRef = useCallback((row: number, col: number, element: HTMLDivElement | null) => {
        cellRefs.current[`${row}-${col}`] = element;
    }, []);
    
    return (
        <GridContainer ref={gridRef}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        ref={element => registerCellRef(rowIndex, colIndex, element)}
                        $filled={cell.filled}
                        $color={cell.color}
                        $isHighlighted={!!(
                            ghostPosition !== null &&
                            rowIndex >= ghostPosition.row &&
                            rowIndex < ghostPosition.row + (selectedShape?.matrix.length || 0) &&
                            colIndex >= ghostPosition.col &&
                            colIndex < ghostPosition.col + (selectedShape?.matrix[0]?.length || 0) &&
                            selectedShape?.matrix[rowIndex - ghostPosition.row]?.[colIndex - ghostPosition.col]
                        )}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        data-row={rowIndex}
                        data-col={colIndex}
                    >
                        {ghostPosition !== null &&
                         rowIndex >= ghostPosition.row &&
                         rowIndex < ghostPosition.row + (selectedShape?.matrix.length || 0) &&
                         colIndex >= ghostPosition.col &&
                         colIndex < ghostPosition.col + (selectedShape?.matrix[0]?.length || 0) &&
                         selectedShape?.matrix[rowIndex - ghostPosition.row]?.[colIndex - ghostPosition.col] && (
                            <GhostShape valid={ghostPosition.valid} />
                        )}
                    </Cell>
                ))
            )}
            
            {highlightedLines.map((line, index) => (
                <LineHighlighter 
                    key={`${line.type}-${line.index}-${index}`} 
                    type={line.type} 
                    index={line.index} 
                />
            ))}
        </GridContainer>
    );
};

export default Grid;