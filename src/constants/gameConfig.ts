/**
 * Конфигурация игры
 */

// Размеры игровой сетки
export const GRID_SIZE = 8;

// Базовое количество очков за очистку одной ячейки
export const BASE_POINTS_PER_CELL = 10;

// Бонусный множитель за одновременную очистку нескольких линий (строки и столбцы)
export const MULTIPLE_LINES_MULTIPLIER = 1.5;

// Множитель комбо, увеличивается с каждым последовательным заполнением линий
// Формула: 1 + (комбо * COMBO_MULTIPLIER_INCREMENT)
export const COMBO_MULTIPLIER_INCREMENT = 0.1;

// Максимальное количество доступных фигур на выбор
export const AVAILABLE_SHAPES_COUNT = 3;

// Минимальное количество фигур, при котором проверяется условие окончания игры
export const MIN_SHAPES_FOR_GAME_OVER_CHECK = 3;

// Длительность анимаций в миллисекундах
export const ANIMATIONS = {
    SHAPE_PLACEMENT: 300,
    LINE_CLEAR: 500,
    SCORE_POPUP: 800,
    SHAPE_GENERATION: 200,
};

// Цвета для фигур
export const SHAPE_COLORS = [
    '#FF5252', // Красный
    '#448AFF', // Синий
    '#66BB6A', // Зеленый
    '#FFCA28', // Желтый
    '#AB47BC', // Фиолетовый
    '#26C6DA', // Бирюзовый
    '#FF7043', // Оранжевый
    '#EC407A', // Розовый
];

// Вероятности генерации различных типов фигур (из 100)
// Чем больше число, тем выше вероятность
export const SHAPE_GENERATION_WEIGHTS = {
    SINGLE: 15,
    LINE_2: 15,
    LINE_3: 13,
    L_SHAPE: 12,
    SQUARE: 12,
    T_SHAPE: 11,
    CROSS: 11,
    Z_SHAPE: 11,
};
