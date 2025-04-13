/**
 * Хук для управления очками и комбо
 */
import { useState, useCallback, useEffect } from 'react';
import { 
    createInitialScoreState, 
    updateScore, 
    saveHighScore, 
    loadHighScore, 
    formatScore, 
    formatComboMultiplier, 
    getComboText, 
    ScoreState 
} from '../core/scoreSystem';

/**
 * Интерфейс опций для хука
 */
interface UseScoreOptions {
    onNewHighScore?: (score: number) => void;
    initialHighScore?: number;
}

/**
 * Хук для управления системой подсчета очков
 */
export function useScore(options: UseScoreOptions = {}) {
    // Загружаем сохраненный рекорд при первой инициализации
    const [scoreState, setScoreState] = useState<ScoreState>(() => 
        createInitialScoreState(options.initialHighScore || loadHighScore())
    );
    
    // Отслеживаем, был ли установлен новый рекорд
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    
    // Эффект для отслеживания нового рекорда
    useEffect(() => {
        if (scoreState.currentScore > 0 && scoreState.currentScore === scoreState.highScore) {
            setIsNewHighScore(true);
            if (options.onNewHighScore) {
                options.onNewHighScore(scoreState.highScore);
            }
        }
    }, [scoreState.currentScore, scoreState.highScore, options.onNewHighScore]);
    
    // Обновление очков после очистки линий
    const addPoints = useCallback((rowsCleared: number, colsCleared: number, cellsCleared: number) => {
        setScoreState(prev => {
            const newState = updateScore(prev, rowsCleared, colsCleared, cellsCleared);
            
            // Сохраняем новый рекорд в локальное хранилище
            if (newState.highScore > prev.highScore) {
                saveHighScore(newState.highScore);
            }
            
            return newState;
        });
    }, []);
    
    // Сброс счета для новой игры
    const resetScore = useCallback(() => {
        setScoreState(prev => createInitialScoreState(prev.highScore));
        setIsNewHighScore(false);
    }, []);
    
    // Форматирование счета для отображения
    const getFormattedScore = useCallback(() => {
        return formatScore(scoreState.currentScore);
    }, [scoreState.currentScore]);
    
    // Форматирование рекорда для отображения
    const getFormattedHighScore = useCallback(() => {
        return formatScore(scoreState.highScore);
    }, [scoreState.highScore]);
    
    // Получение текста комбо
    const getCurrentComboText = useCallback(() => {
        return getComboText(scoreState.combo);
    }, [scoreState.combo]);
    
    // Получение множителя комбо для отображения
    const getFormattedComboMultiplier = useCallback(() => {
        return formatComboMultiplier(scoreState.comboMultiplier);
    }, [scoreState.comboMultiplier]);
    
    // Данные для анимации получения очков
    const [scoreAnimation, setScoreAnimation] = useState<{
        points: number;
        x: number;
        y: number;
        visible: boolean;
    } | null>(null);
    
    // Показ анимации получения очков
    const showScoreAnimation = useCallback((points: number, x: number, y: number) => {
        setScoreAnimation({
            points,
            x,
            y,
            visible: true
        });
        
        // Автоматически скрываем анимацию через определенное время
        setTimeout(() => {
            setScoreAnimation(prev => prev ? { ...prev, visible: false } : null);
        }, 800);
    }, []);
    
    return {
        score: scoreState.currentScore,
        highScore: scoreState.highScore,
        combo: scoreState.combo,
        comboMultiplier: scoreState.comboMultiplier,
        isNewHighScore,
        addPoints,
        resetScore,
        getFormattedScore,
        getFormattedHighScore,
        getCurrentComboText,
        getFormattedComboMultiplier,
        scoreAnimation,
        showScoreAnimation
    };
}