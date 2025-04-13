/**
 * Хук для управления игровым состоянием
 */
import { useState, useCallback, useEffect } from 'react';
import { GameState, Shape } from '../types/game';
import { ScoreState } from '../core/scoreSystem';
import {
    createEmptyGrid,
    canPlaceAnyShape,
    placeShape,
    clearLines,
    canPlaceShape,
    getAllValidPositions,
} from '../core/gameLogic';
import { generateRandomShapes } from '../core/shapeGenerator';
import {
    createInitialScoreState,
    updateScore,
    saveHighScore,
    loadHighScore,
} from '../core/scoreSystem';
import { AVAILABLE_SHAPES_COUNT } from '../constants/gameConfig';

/**
 * Начальное состояние игры
 */
const createInitialState = (): GameState => ({
    grid: createEmptyGrid(),
    availableShapes: generateRandomShapes(AVAILABLE_SHAPES_COUNT),
    score: 0,
    combo: 0,
    isGameOver: false,
    selectedShape: null,
});

/**
 * Расширенное состояние игры с системой очков
 */
export interface ExtendedGameState extends GameState {
    scoreState: ScoreState;
}

/**
 * Хук для управления состоянием игры
 */
export function useGameState() {
    // Основное состояние игры
    const [gameState, setGameState] = useState<ExtendedGameState>(() => ({
        ...createInitialState(),
        scoreState: createInitialScoreState(loadHighScore()),
    }));

    // Выбор фигуры
    const selectShape = useCallback((shape: Shape | null) => {
        setGameState((prev) => ({
            ...prev,
            selectedShape: shape,
        }));
    }, []);

    // Размещение фигуры на сетке
    const placeSelectedShape = useCallback((row: number, col: number) => {
        setGameState((prev) => {
            if (!prev.selectedShape) return prev;

            // Размещаем фигуру на сетке
            const newGrid = placeShape(prev.grid, prev.selectedShape, row, col);

            // Очищаем заполненные линии
            const { newGrid: clearedGrid, clearedCells, rows, cols } = clearLines(newGrid);

            // Обновляем очки
            const newScoreState = updateScore(
                prev.scoreState,
                rows.length,
                cols.length,
                clearedCells.length
            );

            // Удаляем использованную фигуру из списка доступных
            const shapeIndex = prev.availableShapes.findIndex(
                (s) => s.id === prev.selectedShape?.id
            );
            let newShapes = [...prev.availableShapes];

            if (shapeIndex !== -1) {
                // Удаляем использованную фигуру из массива
                newShapes.splice(shapeIndex, 1);
            }

            // Если все фигуры использованы, генерируем новые
            if (newShapes.length === 0) {
                newShapes = generateRandomShapes(AVAILABLE_SHAPES_COUNT);
            }

            // Проверяем условие окончания игры
            const isGameOver = !canPlaceAnyShape(clearedGrid, newShapes);

            // Если игра окончена, сохраняем рекорд
            if (isGameOver) {
                saveHighScore(newScoreState.highScore);
            }

            // Возвращаем обновленное состояние
            return {
                grid: clearedGrid,
                availableShapes: newShapes,
                selectedShape: null,
                score: newScoreState.currentScore,
                combo: newScoreState.combo,
                isGameOver,
                scoreState: newScoreState,
            };
        });
    }, []);

    // Начало новой игры
    const startNewGame = useCallback(() => {
        setGameState((prev) => ({
            ...createInitialState(),
            scoreState: createInitialScoreState(prev.scoreState.highScore),
        }));
    }, []);

    // Метод для добавления новых фигур (после просмотра рекламы)
    const addBonusShapes = useCallback(() => {
        setGameState((prev) => {
            // Генерируем новые фигуры
            const newShapes = generateRandomShapes(AVAILABLE_SHAPES_COUNT);

            // Обновляем статус игры
            const isGameOver = !canPlaceAnyShape(prev.grid, newShapes);

            return {
                ...prev,
                availableShapes: newShapes,
                isGameOver,
            };
        });
    }, []);

    // Проверяем, может ли быть размещена фигура в указанной позиции
    const canPlaceShapeAtPosition = useCallback(
        (shape: Shape, row: number, col: number) => {
            // Проверка может быть сделана с помощью функции из игровой логики
            return canPlaceShape(gameState.grid, shape, row, col);
        },
        [gameState.grid]
    );

    // Проверка наличия допустимых ходов для каждой доступной фигуры
    const checkValidMovesForShapes = useCallback(() => {
        return gameState.availableShapes.map((shape) => {
            const positions = getAllValidPositions(gameState.grid, shape);
            return {
                shapeId: shape.id,
                hasValidMoves: positions.length > 0,
                validPositionsCount: positions.length,
            };
        });
    }, [gameState.grid, gameState.availableShapes]);

    // При первой инициализации или при изменении состояния игры
    // проверяем условие окончания игры
    useEffect(() => {
        // Если игра уже окончена, ничего не делаем
        if (gameState.isGameOver) return;

        // Проверяем, есть ли возможность разместить хотя бы одну фигуру
        const isGameOver = !canPlaceAnyShape(gameState.grid, gameState.availableShapes);

        // Если игра окончена, обновляем состояние
        if (isGameOver) {
            saveHighScore(gameState.scoreState.highScore);
            setGameState((prev) => ({ ...prev, isGameOver: true }));
        }
    }, [
        gameState.grid,
        gameState.availableShapes,
        gameState.isGameOver,
        gameState.scoreState.highScore,
    ]);

    // Обновление состояния очков
    const updateScoreState = useCallback((newScoreState: ScoreState) => {
        setGameState((prev) => ({
            ...prev,
            score: newScoreState.currentScore,
            combo: newScoreState.combo,
            scoreState: newScoreState,
        }));
    }, []);

    return {
        gameState,
        selectShape,
        placeSelectedShape,
        startNewGame,
        addBonusShapes,
        canPlaceShapeAtPosition,
        checkValidMovesForShapes,
        updateScoreState,
    };
}
