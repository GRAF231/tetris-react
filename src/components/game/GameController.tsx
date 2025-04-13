/**
 * Контроллер игры, объединяющий все компоненты
 */

import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useShapes } from '../../hooks/useShapes';
import { useScore } from '../../hooks/useScore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useGhostPosition } from '../../hooks/useGhostPosition';
import { Shape } from '../../types/game';
import { canPlaceShape } from '../../core/gameLogic';
import { GameContainer } from './GameController.styles';
import MobileGameLayout from './MobileGameLayout';
import DesktopGameLayout from './DesktopGameLayout';
import GameOverPanel from './GameOverPanel';

interface Props {
    onShare?: (score: number) => void;
    onMainMenu?: () => void;
}

/**
 * Основной контроллер игры
 */
export const GameController: FC<Props> = ({ onShare, onMainMenu }) => {
    const {
        gameState,
        selectShape,
        placeSelectedShape,
        startNewGame,
        addBonusShapes,
        updateScoreState,
    } = useGameState();

    const {
        shapes,
        draggingShape,
        registerShapeRef,
        startDragging,
        handleDragging,
        stopDragging,
        rotateShapeById,
    } = useShapes(gameState.availableShapes);

    const {
        score,
        highScore,
        combo,
        comboMultiplier,
        isNewHighScore,
        resetScore,
        getCurrentComboText,
        scoreAnimation,
        showScoreAnimation,
        addPoints,
    } = useScore();

    // Используем хук для управления позицией "призрака" фигуры
    const { ghostPosition, highlightedLines, updateGhostPosition, resetGhostPosition } =
        useGhostPosition({ grid: gameState.grid, selectedShape: gameState.selectedShape });

    // Добавляем определение типа устройства
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Определяем тип устройства по ширине экрана
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Проверяем при загрузке
        checkIsMobile();

        // Добавляем слушатель изменения размера окна
        window.addEventListener('resize', checkIsMobile);

        // Убираем слушатель при размонтировании компонента
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    const gridRef = useRef<HTMLDivElement>(null);

    const handleRestart = useCallback(() => {
        startNewGame();
        resetScore();
        resetGhostPosition();
    }, [startNewGame, resetScore, resetGhostPosition]);

    const handleCellClick = useCallback(
        (row: number, col: number, shapeToUse: Shape | null) => {
            if (!shapeToUse) return;

            // Проверяем позицию размещения фигуры
            const check = canPlaceShape(gameState.grid, shapeToUse, row, col);

            if (check.valid) {
                if (!gameState.selectedShape && shapeToUse) {
                    selectShape(shapeToUse);
                    setTimeout(() => placeSelectedShape(row, col), 0);
                } else {
                    placeSelectedShape(row, col);
                }

                if (check.linesWillBeFilled && gridRef.current) {
                    const gridRect = gridRef.current.getBoundingClientRect();
                    const centerX = gridRect.left + gridRect.width / 2;
                    const centerY = gridRect.top + gridRect.height / 2;

                    const rowsCount = check.linesWillBeFilled.rows.length;
                    const colsCount = check.linesWillBeFilled.cols.length;
                    const cellsCount =
                        rowsCount * gameState.grid[0].length +
                        colsCount * gameState.grid.length -
                        rowsCount * colsCount;

                    addPoints(rowsCount, colsCount, cellsCount);

                    updateScoreState({
                        currentScore: score,
                        highScore: highScore,
                        combo: combo,
                        comboMultiplier: comboMultiplier,
                        lastClearedCells: cellsCount,
                    });

                    showScoreAnimation(cellsCount * 10, centerX, centerY);
                }
            }
        },
        [
            gameState.grid,
            gameState.selectedShape,
            placeSelectedShape,
            addPoints,
            updateScoreState,
            score,
            highScore,
            combo,
            comboMultiplier,
            showScoreAnimation,
            selectShape,
        ]
    );

    // Используем хук для управления Drag-and-Drop
    const { handleDragStart, handleDragMove, handleDragEnd } = useDragAndDrop({
        shapes,
        draggingShape,
        gameGrid: gameState.grid,
        selectedShape: gameState.selectedShape,
        selectShape,
        startDragging,
        handleDragging,
        stopDragging,
        onPlaceShape: handleCellClick,
        resetGhostPosition,
        updateGhostPosition,
        gridRef,
    });

    const handleWatchAd = useCallback(() => {
        addBonusShapes();
    }, [addBonusShapes]);

    const handleShare = useCallback(() => {
        if (onShare) {
            onShare(score);
        }
    }, [score, onShare]);

    const commonProps = {
        grid: gameState.grid,
        shapes,
        score,
        highScore,
        combo,
        comboMultiplier,
        comboText: getCurrentComboText(),
        isNewHighScore,
        scoreAnimation,
        selectedShape: gameState.selectedShape,
        selectedShapeId: gameState.selectedShape?.id || null,
        ghostPosition,
        highlightedLines,
        draggingShape,
        gridRef,
        onCellClick: handleCellClick,
        onShapeSelect: selectShape,
        onShapeRotate: rotateShapeById,
        onDragStart: handleDragStart,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
        registerShapeRef,
    };

    return (
        <GameContainer>
            {/* Используем условный рендеринг в зависимости от типа устройства */}
            {isMobile ? (
                <MobileGameLayout {...commonProps} />
            ) : (
                <DesktopGameLayout {...commonProps} />
            )}

            {/* Панель завершения игры */}
            <GameOverPanel
                isGameOver={gameState.isGameOver}
                score={score}
                highScore={highScore}
                isNewHighScore={isNewHighScore}
                onRestart={handleRestart}
                onWatchAd={handleWatchAd}
                onShare={onShare ? handleShare : undefined}
                onMainMenu={onMainMenu}
            />
        </GameContainer>
    );
};

export default GameController;
