/**
 * Типы, связанные с игрой "Тетрис-блоки"
 */

/**
 * Перечисление типов фигур
 */
export enum ShapeType {
    SINGLE = 'SINGLE',       // одиночный блок
    LINE_2 = 'LINE_2',       // линия из 2 блоков
    LINE_3 = 'LINE_3',       // линия из 3 блоков
    L_SHAPE = 'L_SHAPE',     // Г-образная фигура
    SQUARE = 'SQUARE',       // квадрат из 4 блоков
    T_SHAPE = 'T_SHAPE',     // Т-образная фигура
    CROSS = 'CROSS',         // крестообразная фигура
    Z_SHAPE = 'Z_SHAPE',     // Z-образная фигура
}

/**
 * Ориентация фигуры (в градусах)
 */
export enum ShapeOrientation {
    DEGREES_0 = 0,
    DEGREES_90 = 90,
    DEGREES_180 = 180,
    DEGREES_270 = 270,
}

/**
 * Клетка игровой сетки
 */
export interface Cell {
    filled: boolean;
    color?: string;
    id?: string;
}

/**
 * Игровая сетка
 */
export type Grid = Cell[][];

/**
 * Структура игровой фигуры
 */
export interface Shape {
    id: string;
    type: ShapeType;
    orientation: ShapeOrientation;
    color: string;
    matrix: boolean[][];
    position?: {
        x: number;
        y: number;
    };
}

/**
 * Состояние игры
 */
export interface GameState {
    grid: Grid;
    availableShapes: Shape[];
    score: number;
    combo: number;
    isGameOver: boolean;
    selectedShape: Shape | null;
}

/**
 * Результат проверки возможности размещения фигуры
 */
export interface PlacementCheck {
    valid: boolean;
    linesWillBeFilled?: {
        rows: number[];
        cols: number[];
    };
}