/**
 * Основная игровая логика для "Тетрис-блоки"
 */
import { Grid, Shape, PlacementCheck } from '../types/game';
import { GRID_SIZE } from '../constants/gameConfig';
import { cloneGrid, isInBounds } from '../utils/stateUtils';

/**
 * Проверяет, может ли фигура быть размещена на сетке в указанной позиции
 * @param grid Текущая игровая сетка
 * @param shape Проверяемая фигура
 * @param startRow Начальная позиция по строке
 * @param startCol Начальная позиция по столбцу
 * @returns Информация о возможности размещения и о линиях, которые будут очищены
 */
export function canPlaceShape(
    grid: Grid,
    shape: Shape,
    startRow: number,
    startCol: number
): PlacementCheck {
    const matrix = shape.matrix;

    // Проверяем, что фигура полностью помещается на сетку и не перекрывает заполненные ячейки
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) {
                const gridRow = startRow + i;
                const gridCol = startCol + j;

                // Проверяем границы сетки
                if (!isInBounds(grid, gridRow, gridCol)) {
                    return { valid: false };
                }

                // Проверяем, что ячейка пуста
                if (grid[gridRow][gridCol].filled) {
                    return { valid: false };
                }
            }
        }
    }

    // Создаем временную сетку, чтобы проверить, какие линии будут заполнены
    const tempGrid = cloneGrid(grid);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) {
                const gridRow = startRow + i;
                const gridCol = startCol + j;
                tempGrid[gridRow][gridCol] = {
                    filled: true,
                    color: shape.color,
                    id: shape.id,
                };
            }
        }
    }

    // Проверяем, какие строки и столбцы будут заполнены
    const filledRows = getFilledRows(tempGrid);
    const filledCols = getFilledColumns(tempGrid);

    return {
        valid: true,
        linesWillBeFilled: {
            rows: filledRows,
            cols: filledCols,
        },
    };
}

/**
 * Размещает фигуру на сетке
 * @param grid Текущая игровая сетка
 * @param shape Размещаемая фигура
 * @param startRow Начальная позиция по строке
 * @param startCol Начальная позиция по столбцу
 * @returns Обновленная сетка
 */
export function placeShape(grid: Grid, shape: Shape, startRow: number, startCol: number): Grid {
    const newGrid = cloneGrid(grid);
    const matrix = shape.matrix;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) {
                const gridRow = startRow + i;
                const gridCol = startCol + j;

                if (isInBounds(newGrid, gridRow, gridCol)) {
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

/**
 * Проверяет, заполнена ли строка
 * @param grid Игровая сетка
 * @param rowIndex Индекс строки
 * @returns true, если строка полностью заполнена
 */
export function isRowFilled(grid: Grid, rowIndex: number): boolean {
    return grid[rowIndex].every((cell) => cell.filled);
}

/**
 * Проверяет, заполнен ли столбец
 * @param grid Игровая сетка
 * @param colIndex Индекс столбца
 * @returns true, если столбец полностью заполнен
 */
export function isColumnFilled(grid: Grid, colIndex: number): boolean {
    return grid.every((row) => row[colIndex].filled);
}

/**
 * Находит все заполненные строки в сетке
 * @param grid Игровая сетка
 * @returns Массив индексов заполненных строк
 */
export function getFilledRows(grid: Grid): number[] {
    return grid
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => row.every((cell) => cell.filled))
        .map(({ index }) => index);
}

/**
 * Находит все заполненные столбцы в сетке
 * @param grid Игровая сетка
 * @returns Массив индексов заполненных столбцов
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
 * Очищает заполненные строки и столбцы
 * @param grid Игровая сетка
 * @returns Объект с обновленной сеткой, списком очищенных ячеек и индексами строк и столбцов
 */
export function clearLines(grid: Grid): {
    newGrid: Grid;
    clearedCells: { row: number; col: number }[];
    rows: number[];
    cols: number[];
} {
    const filledRows = getFilledRows(grid);
    const filledCols = getFilledColumns(grid);
    const newGrid = cloneGrid(grid);
    const clearedCells: { row: number; col: number }[] = [];

    // Собираем все ячейки, которые будут очищены
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (filledRows.includes(row) || filledCols.includes(col)) {
                clearedCells.push({ row, col });
                newGrid[row][col] = {
                    filled: false,
                    color: undefined,
                    id: undefined,
                };
            }
        }
    }

    return {
        newGrid,
        clearedCells,
        rows: filledRows,
        cols: filledCols,
    };
}

/**
 * Подсчитывает количество очков за очистку линий
 * @param rowsCleared Количество очищенных строк
 * @param colsCleared Количество очищенных столбцов
 * @param cellsCleared Количество очищенных ячеек
 * @param comboMultiplier Множитель комбо
 * @returns Количество заработанных очков
 */
export function calculateScore(
    rowsCleared: number,
    colsCleared: number,
    cellsCleared: number,
    comboMultiplier: number = 1
): number {
    const BASE_POINTS_PER_CELL = 10;
    const MULTIPLE_LINES_MULTIPLIER = 1.5;

    // Базовые очки за очищенные ячейки
    let score = cellsCleared * BASE_POINTS_PER_CELL;

    // Применяем множитель за множественную очистку (и строки, и столбцы)
    if (rowsCleared > 0 && colsCleared > 0) {
        score *= MULTIPLE_LINES_MULTIPLIER;
    }

    // Применяем множитель комбо
    score *= comboMultiplier;

    // Округляем до целого числа
    return Math.floor(score);
}

/**
 * Проверяет, можно ли разместить хотя бы одну из фигур на сетке
 * @param grid Игровая сетка
 * @param shapes Массив доступных фигур
 * @returns true, если есть возможность разместить хотя бы одну фигуру
 */
export function canPlaceAnyShape(grid: Grid, shapes: Shape[]): boolean {
    // Если нет доступных фигур, игра окончена
    if (!shapes.length) return false;

    for (const shape of shapes) {
        // Перебираем все возможные позиции на сетке
        for (let row = 0; row <= GRID_SIZE - (shape.matrix.length || 1); row++) {
            for (let col = 0; col <= GRID_SIZE - (shape.matrix[0]?.length || 1); col++) {
                if (canPlaceShape(grid, shape, row, col).valid) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Находит все возможные позиции для размещения фигуры
 * @param grid Игровая сетка
 * @param shape Фигура
 * @returns Массив допустимых позиций с информацией о заполняемых линиях
 */
export function getAllValidPositions(
    grid: Grid,
    shape: Shape
): { row: number; col: number; willClearLines: boolean }[] {
    const validPositions: { row: number; col: number; willClearLines: boolean }[] = [];

    for (let row = 0; row <= GRID_SIZE - (shape.matrix.length || 1); row++) {
        for (let col = 0; col <= GRID_SIZE - (shape.matrix[0]?.length || 1); col++) {
            const result = canPlaceShape(grid, shape, row, col);
            if (result.valid) {
                validPositions.push({
                    row,
                    col,
                    willClearLines:
                        (result.linesWillBeFilled?.rows.length || 0) > 0 ||
                        (result.linesWillBeFilled?.cols.length || 0) > 0,
                });
            }
        }
    }

    return validPositions;
}

/**
 * Создает пустую игровую сетку
 * @param size Размер сетки (по умолчанию 8x8)
 * @returns Пустая игровая сетка
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
