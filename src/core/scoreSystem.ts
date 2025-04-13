/**
 * Система подсчета очков для игры "Тетрис-блоки"
 */
import { BASE_POINTS_PER_CELL, MULTIPLE_LINES_MULTIPLIER, COMBO_MULTIPLIER_INCREMENT } from '../constants/gameConfig';

/**
 * Состояние системы очков
 */
export interface ScoreState {
    currentScore: number;
    highScore: number;
    combo: number;
    lastClearedCells: number;
    comboMultiplier: number;
}

/**
 * Создает начальное состояние системы очков
 */
export function createInitialScoreState(savedHighScore?: number): ScoreState {
    return {
        currentScore: 0,
        highScore: savedHighScore || 0,
        combo: 0,
        lastClearedCells: 0,
        comboMultiplier: 1
    };
}

/**
 * Рассчитывает коэффициент комбо
 * @param combo Текущее комбо
 * @returns Коэффициент множителя для комбо
 */
export function calculateComboMultiplier(combo: number): number {
    return 1 + (combo * COMBO_MULTIPLIER_INCREMENT);
}

/**
 * Обновляет состояние очков после очистки линий
 * @param state Текущее состояние очков
 * @param rowsCleared Количество очищенных строк
 * @param colsCleared Количество очищенных столбцов
 * @param cellsCleared Количество очищенных ячеек
 * @returns Обновленное состояние очков
 */
export function updateScore(
    state: ScoreState,
    rowsCleared: number,
    colsCleared: number,
    cellsCleared: number
): ScoreState {
    // Если не было очищенных ячеек, сбрасываем комбо
    if (cellsCleared === 0) {
        return {
            ...state,
            combo: 0,
            comboMultiplier: 1,
            lastClearedCells: 0
        };
    }

    // Рассчитываем новое комбо
    // Комбо увеличивается только если были очищены ячейки в прошлый раз
    const newCombo = state.lastClearedCells > 0 ? state.combo + 1 : 0;
    
    // Рассчитываем новый множитель комбо
    const comboMultiplier = calculateComboMultiplier(newCombo);
    
    // Рассчитываем базовые очки
    let points = cellsCleared * BASE_POINTS_PER_CELL;
    
    // Применяем множитель за очистку нескольких линий (и строки, и столбцы)
    if (rowsCleared > 0 && colsCleared > 0) {
        points *= MULTIPLE_LINES_MULTIPLIER;
    }
    
    // Применяем множитель комбо
    points *= comboMultiplier;
    
    // Округляем до целого
    const roundedPoints = Math.floor(points);
    
    // Обновляем счет
    const newScore = state.currentScore + roundedPoints;
    
    // Проверяем, не побит ли рекорд
    const newHighScore = Math.max(state.highScore, newScore);
    
    return {
        currentScore: newScore,
        highScore: newHighScore,
        combo: newCombo,
        lastClearedCells: cellsCleared,
        comboMultiplier
    };
}

/**
 * Обновляет рекорд в локальном хранилище
 * @param highScore Значение рекорда для сохранения
 */
export function saveHighScore(highScore: number): void {
    try {
        localStorage.setItem('tetrisBlocksHighScore', highScore.toString());
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
}

/**
 * Загружает рекорд из локального хранилища
 * @returns Значение рекорда или undefined, если рекорд не найден
 */
export function loadHighScore(): number | undefined {
    try {
        const value = localStorage.getItem('tetrisBlocksHighScore');
        return value ? parseInt(value, 10) : undefined;
    } catch (e) {
        console.error('Failed to load high score:', e);
        return undefined;
    }
}

/**
 * Форматирует очки для отображения
 * @param score Очки для форматирования
 * @returns Отформатированная строка очков
 */
export function formatScore(score: number): string {
    return score.toLocaleString();
}

/**
 * Форматирует множитель комбо для отображения
 * @param multiplier Множитель комбо
 * @returns Отформатированная строка множителя
 */
export function formatComboMultiplier(multiplier: number): string {
    return `×${multiplier.toFixed(1)}`;
}

/**
 * Получает текстовое описание для текущего комбо
 * @param combo Значение комбо
 * @returns Текстовое описание комбо
 */
export function getComboText(combo: number): string {
    if (combo <= 0) return '';
    if (combo === 1) return 'Комбо!';
    if (combo === 2) return 'Двойное комбо!';
    if (combo === 3) return 'Тройное комбо!';
    if (combo === 4) return 'Супер комбо!';
    if (combo <= 6) return 'Мега комбо!';
    if (combo <= 9) return 'Ультра комбо!';
    return 'MONSTER COMBO!!!';
}