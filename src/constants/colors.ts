/**
 * Цветовая схема приложения
 */

// Основные цвета
export const PRIMARY = '#3F51B5';       // Основной цвет (синий индиго)
export const SECONDARY = '#FF4081';     // Акцентный цвет (розовый)
export const BACKGROUND = '#FAFAFA';    // Фон приложения (почти белый)
export const TEXT_PRIMARY = '#212121';  // Основной цвет текста (почти черный)
export const TEXT_SECONDARY = '#757575'; // Вторичный цвет текста (серый)

// Цвета для состояний
export const SUCCESS = '#4CAF50';       // Успех (зеленый)
export const ERROR = '#F44336';         // Ошибка (красный)
export const WARNING = '#FFC107';       // Предупреждение (желтый)
export const INFO = '#2196F3';          // Информация (синий)

// Цвета интерфейса
export const GRID_BACKGROUND = '#EEEEEE';  // Фон сетки
export const GRID_BORDER = '#BDBDBD';      // Граница сетки
export const MODAL_BACKGROUND = 'rgba(0, 0, 0, 0.5)'; // Фон модальных окон

// Градиенты
export const GRADIENTS = {
    PRIMARY: 'linear-gradient(135deg, #3F51B5 0%, #5C6BC0 100%)',
    SECONDARY: 'linear-gradient(135deg, #FF4081 0%, #F50057 100%)',
    SCORE: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
};

// Тени
export const SHADOWS = {
    SMALL: '0 2px 5px rgba(0, 0, 0, 0.15)',
    MEDIUM: '0 4px 10px rgba(0, 0, 0, 0.2)',
    LARGE: '0 8px 20px rgba(0, 0, 0, 0.2)',
};

// Прозрачность
export const OPACITY = {
    DISABLED: 0.5,
    HOVER: 0.8,
    GHOST_SHAPE_VALID: 0.6,
    GHOST_SHAPE_INVALID: 0.4,
};