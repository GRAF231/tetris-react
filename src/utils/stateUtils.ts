/**
 * Утилитарные функции для иммутабельной работы с состоянием
 */
import { Grid, Cell, Shape } from '../types/game';
import { GRID_SIZE } from '../constants/gameConfig';

/**
 * Создает пустую игровую сетку заданного размера
 */
export function createEmptyGrid(size: number = GRID_SIZE): Grid {
    return Array(size)
        .fill(null)
        .map(() =>
            Array(size)
                .fill(null)
                .map(() => ({ filled: false }))
        );
}

/**
 * Создает копию сетки для иммутабельного обновления
 */
export function cloneGrid(grid: Grid): Grid {
    return grid.map((row) => [...row.map((cell) => ({ ...cell }))]);
}

/**
 * Обновляет ячейку в сетке, возвращая новую сетку
 */
export function updateCell(grid: Grid, row: number, col: number, updates: Partial<Cell>): Grid {
    const newGrid = cloneGrid(grid);
    newGrid[row][col] = { ...newGrid[row][col], ...updates };
    return newGrid;
}

/**
 * Проверяет, находится ли координата в пределах сетки
 */
export function isInBounds(grid: Grid, row: number, col: number): boolean {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

/**
 * Проверяет, заполнена ли строка полностью
 */
export function isRowFilled(grid: Grid, rowIndex: number): boolean {
    return grid[rowIndex].every((cell) => cell.filled);
}

/**
 * Проверяет, заполнен ли столбец полностью
 */
export function isColumnFilled(grid: Grid, colIndex: number): boolean {
    return grid.every((row) => row[colIndex].filled);
}

/**
 * Находит все заполненные строки в сетке
 */
export function getFilledRows(grid: Grid): number[] {
    return grid
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => row.every((cell) => cell.filled))
        .map(({ index }) => index);
}

/**
 * Находит все заполненные столбцы в сетке
 */
export function getFilledColumns(grid: Grid): number[] {
    const columnCount = grid[0].length;
    return Array(columnCount)
        .fill(null)
        .map((_, colIndex) => ({
            colIndex,
            filled: grid.every((row) => row[colIndex].filled),
        }))
        .filter((col) => col.filled)
        .map((col) => col.colIndex);
}

/**
 * Очищает заполненные строки и столбцы, возвращая новую сетку
 */
export function clearFilledLines(grid: Grid): {
    newGrid: Grid;
    clearedCells: { row: number; col: number }[];
    rows: number[];
    cols: number[];
} {
    const filledRows = getFilledRows(grid);
    const filledCols = getFilledColumns(grid);
    let newGrid = cloneGrid(grid);
    const clearedCells: { row: number; col: number }[] = [];

    // Собираем все ячейки, которые будут очищены
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (filledRows.includes(row) || filledCols.includes(col)) {
                clearedCells.push({ row, col });
            }
        }
    }

    // Обновляем сетку, очищая нужные ячейки
    clearedCells.forEach(({ row, col }) => {
        newGrid = updateCell(newGrid, row, col, { filled: false, color: undefined, id: undefined });
    });

    return {
        newGrid,
        clearedCells,
        rows: filledRows,
        cols: filledCols,
    };
}

/**
 * Размещает фигуру на сетке, возвращая новую сетку
 */
export function placeShapeOnGrid(
    grid: Grid,
    shape: Shape,
    startRow: number,
    startCol: number
): Grid {
    const newGrid = cloneGrid(grid);
    const matrix = shape.matrix;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) {
                const gridRow = startRow + i;
                const gridCol = startCol + j;

                if (isInBounds(grid, gridRow, gridCol)) {
                    newGrid[gridRow][gridCol] = {
                        filled: true,
                        color: shape.color,
                        id: shape.id,
                    };
                }
            }
        }
    }

    return newGrid;
}
