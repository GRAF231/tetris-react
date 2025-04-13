/**
 * Контроллер игры, объединяющий все компоненты
 */
import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Grid from './Grid';
import Preview from './Preview';
import Score from './Score';
import GameOverModal from './GameOverModal';
import { useGameState } from '../../hooks/useGameState';
import { useShapes } from '../../hooks/useShapes';
import { useScore } from '../../hooks/useScore';
import { Shape, PlacementCheck } from '../../types/game';
import { canPlaceShape, getAllValidPositions } from '../../core/gameLogic';
import { getComboText } from '../../core/scoreSystem';

// Стилизованные компоненты
const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px;
    
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
    }
`;

const GridContainer = styled.div`
    flex: 1;
    position: relative;
`;

const SidePanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    
    @media (min-width: 768px) {
        width: 300px;
        gap: 20px;
    }
`;

// Контейнер для мобильного вида (очки вверху, фигуры внизу)
const MobileLayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 80px); // Учитываем уменьшенную шапку
    
    @media (min-width: 768px) {
        flex-direction: row;
        height: auto;
    }
`;

// Стили для очков на мобильных устройствах
const MobileScoreContainer = styled.div`
    margin-bottom: 12px;
    
    @media (min-width: 768px) {
        display: none;
    }
`;

// Стили для горизонтального отображения фигур на мобильных устройствах
const MobilePreviewContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: auto; // Прижимаем к низу экрана
    
    @media (min-width: 768px) {
        display: none;
    }
`;

// Стили для десктопного отображения фигур
const DesktopPreviewContainer = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: block;
    }
`;

// Стили для десктопного отображения очков
const DesktopScoreContainer = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: block;
    }
`;

interface Props {
    onShare?: (score: number) => void;
    onMainMenu?: () => void;
}

export const GameController: FC<Props> = ({ onShare, onMainMenu }) => {
    // Инициализируем основные хуки
    const {
        gameState,
        selectShape,
        placeSelectedShape,
        startNewGame,
        addBonusShapes,
        updateScoreState
    } = useGameState();
    
    const {
        shapes,
        draggingShape,
        registerShapeRef,
        startDragging,
        handleDragging,
        stopDragging,
        rotateShapeById
    } = useShapes(gameState.availableShapes);
    
    const {
        score,
        highScore,
        combo,
        comboMultiplier,
        isNewHighScore,
        resetScore,
        getCurrentComboText,
        getFormattedComboMultiplier,
        scoreAnimation,
        showScoreAnimation,
        addPoints
    } = useScore();
    
    // Ref для хранения текущей выбранной фигуры, чтобы избежать проблем с async обновлением состояния
    const selectedShapeRef = useRef<Shape | null>(null);
    
    // Локальное состояние для позиции "призрака" фигуры
    const [ghostPosition, setGhostPosition] = useState<{
        row: number;
        col: number;
        valid: boolean;
    } | null>(null);
    
    // Состояние для подсветки линий, которые будут очищены
    const [highlightedLines, setHighlightedLines] = useState<Array<{
        type: 'row' | 'column';
        index: number;
    }>>([]);
    
    // Ссылка на игровую сетку для расчета позиции
    const gridRef = useRef<HTMLDivElement>(null);
    
    // Перезапуск игры
    const handleRestart = useCallback(() => {
        startNewGame();
        resetScore();
        setGhostPosition(null);
        setHighlightedLines([]);
    }, [startNewGame, resetScore]);
    
    // Обработка выбора фигуры
    const handleShapeSelect = useCallback((shape: Shape) => {
        selectShape(shape);
    }, [selectShape]);
    
    const handleCellClick = useCallback((row: number, col: number) => {
        const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
        
        if (!shapeToUse) return;
        
        const nonNullShape: Shape = shapeToUse;
        const check = canPlaceShape(gameState.grid, nonNullShape, row, col);
        
        if (check.valid) {
            if (!gameState.selectedShape && shapeToUse) {
                selectShape(shapeToUse);
                setTimeout(() => placeSelectedShape(row, col), 0);
            } else {
                placeSelectedShape(row, col);
            }
            
            // Показываем анимацию начисления очков и обновляем состояние очков
            if (check.linesWillBeFilled && gridRef.current) {
                const gridRect = gridRef.current.getBoundingClientRect();
                const centerX = gridRect.left + gridRect.width / 2;
                const centerY = gridRect.top + gridRect.height / 2;
                
                // Подсчитываем количество очков
                const rowsCount = check.linesWillBeFilled.rows.length;
                const colsCount = check.linesWillBeFilled.cols.length;
                const cellsCount = rowsCount * gameState.grid[0].length +
                                  colsCount * gameState.grid.length -
                                  (rowsCount * colsCount); // Вычитаем повторно посчитанные ячейки
                
                // Добавляем очки
                addPoints(rowsCount, colsCount, cellsCount);
                
                // Обновляем стейт очков в gameState
                updateScoreState({
                    currentScore: score,
                    highScore: highScore,
                    combo: combo,
                    comboMultiplier: comboMultiplier,
                    lastClearedCells: cellsCount
                });
                
                // Отображаем анимацию
                showScoreAnimation(cellsCount * 10, centerX, centerY);
            }
        }
    }, [gameState.grid, gameState.selectedShape, placeSelectedShape, addPoints, updateScoreState, score, highScore, combo, comboMultiplier, showScoreAnimation]);
    
    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        handleDragging(clientX, clientY);
        
        if (!gridRef.current) return;
        
        const effectiveShape = gameState.selectedShape || selectedShapeRef.current;
        
        if (!effectiveShape && draggingShape && shapes.length > 0) {
            const draggedShape = shapes.find(s => s.id === draggingShape.shapeId);
            if (draggedShape) {
                selectedShapeRef.current = draggedShape;
                selectShape(draggedShape);
            } else {
                return;
            }
        }
        
        const shapeToUse = effectiveShape || selectedShapeRef.current;
        
        if (!shapeToUse) return;
        
        try {
            const gridRect = gridRef.current.getBoundingClientRect();
            const buffer = 5;
            
            if (
                clientX >= gridRect.left - buffer &&
                clientX <= gridRect.right + buffer &&
                clientY >= gridRect.top - buffer &&
                clientY <= gridRect.bottom + buffer
            ) {
                const cellSize = gridRect.width / gameState.grid[0].length;
                let row = Math.floor((clientY - gridRect.top) / cellSize);
                let col = Math.floor((clientX - gridRect.left) / cellSize);
                
                row = Math.max(0, Math.min(row, gameState.grid.length - 1));
                col = Math.max(0, Math.min(col, gameState.grid[0].length - 1));
                
                const nonNullShape: Shape = shapeToUse;
                const check: PlacementCheck = canPlaceShape(
                    gameState.grid,
                    nonNullShape,
                    row,
                    col
                );
                
                const newGhostPosition = {
                    row,
                    col,
                    valid: check.valid
                };
                
                setGhostPosition(newGhostPosition);
                
                // Обновляем подсветку линий
                if (check.valid && check.linesWillBeFilled) {
                    const lines = [
                        ...check.linesWillBeFilled.rows.map(index => ({ type: 'row' as const, index })),
                        ...check.linesWillBeFilled.cols.map(index => ({ type: 'column' as const, index }))
                    ];
                    setHighlightedLines(lines);
                } else {
                    setHighlightedLines([]);
                }
            } else {
                setGhostPosition(null);
                setHighlightedLines([]);
            }
        } catch (error) {
            console.error("Error during drag move:", error);
        }
    }, [gameState.selectedShape, gameState.grid, handleDragging]);
    
    // Сохраняем последнюю известную позицию ghostPosition в ref
    // Это дает нам доступ к актуальной позиции даже если состояние еще не обновилось
    const lastGhostPositionRef = useRef<{row: number, col: number, valid: boolean} | null>(null);
    
    // Когда ghostPosition меняется, обновляем ref
    useEffect(() => {
        if (ghostPosition) {
            lastGhostPositionRef.current = ghostPosition;
        }
    }, [ghostPosition]);
    
    // Обработка окончания перетаскивания
    // Добавляем параметры clientX и clientY, чтобы иметь доступ к последней позиции курсора
    // Для десктопа это особенно важно, так как события могут быть потеряны
    const handleDragEnd = useCallback((clientX?: number, clientY?: number) => {
        // Сохраняем текущее состояние призрака, так как оно может сброситься после stopDragging
        const currentGhostPosition = ghostPosition;
        // Сохраняем текущий draggingShape, так как он может быть сброшен после stopDragging
        const currentDraggingShape = draggingShape;
        
        // Используем либо фигуру из состояния, либо из ref
        const effectiveShape = gameState.selectedShape || selectedShapeRef.current;
        
        // Если нет выбранной фигуры, но есть координаты и идет перетаскивание
        // попробуем найти фигуру по ID перетаскиваемой фигуры
        if (!effectiveShape && draggingShape && shapes.length > 0) {
            console.log("No selected shape, but dragging is active. Trying to find shape by ID:", draggingShape.shapeId);
            const draggedShape = shapes.find(s => s.id === draggingShape.shapeId);
            if (draggedShape) {
                console.log("Found shape by ID, selecting it now:", draggedShape);
                selectedShapeRef.current = draggedShape; // Сохраняем в ref для немедленного использования
                selectShape(draggedShape);
            }
        }
        
        try {
            // Если переданы координаты мыши/касания, используем их для определения положения
            if (clientX !== undefined && clientY !== undefined && (gameState.selectedShape || selectedShapeRef.current) && gridRef.current) {
                const gridRect = gridRef.current.getBoundingClientRect();
                // Проверяем, находится ли курсор где-то рядом с сеткой (с большим запасом)
                const buffer = 20; // Увеличиваем буфер для десктопа
                
                if (
                    clientX >= gridRect.left - buffer &&
                    clientX <= gridRect.right + buffer &&
                    clientY >= gridRect.top - buffer &&
                    clientY <= gridRect.bottom + buffer
                ) {
                    
                    // Вычисляем позицию в сетке
                    const cellSize = gridRect.width / gameState.grid[0].length;
                    let row = Math.floor((clientY - gridRect.top) / cellSize);
                    let col = Math.floor((clientX - gridRect.left) / cellSize);
                    
                    // Ограничиваем значения в пределах сетки
                    row = Math.max(0, Math.min(row, gameState.grid.length - 1));
                    col = Math.max(0, Math.min(col, gameState.grid[0].length - 1));
                    
                    console.log("Calculated grid position from coordinates:", { row, col });
                    
                    // Используем либо фигуру из состояния, либо из ref
                    const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                    
                    // Проверяем, что фигура существует
                    if (!shapeToUse) {
                        console.log("No shape available for placement check");
                        return;
                    }
                    
                    // Убеждаемся, что shapeToUse не null для TypeScript
                    const nonNullShape: Shape = shapeToUse;
                    
                    // Проверяем возможность размещения
                    const check = canPlaceShape(
                        gameState.grid,
                        nonNullShape,
                        row,
                        col
                    );
                    
                    if (check.valid) {
                        // Важно: НЕ вызываем stopDragging() до завершения handleCellClick
                        handleCellClick(row, col);
                        // Устанавливаем небольшую задержку перед очисткой состояния
                        setTimeout(() => {
                            stopDragging();
                            setGhostPosition(null);
                            setHighlightedLines([]);
                            // Также очищаем selectedShapeRef после размещения
                            selectedShapeRef.current = null;
                        }, 50);
                        return;
                    } else {
                        // Если прямо по координатам не получается разместить, проверяем соседние ячейки
                        // Если прямо по координатам не получается разместить, проверяем соседние ячейки
                        for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, gameState.grid.length - 1); r++) {
                            for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, gameState.grid[0].length - 1); c++) {
                                const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                                
                                // Проверяем, что фигура существует
                                if (!shapeToUse) continue;
                                
                                // Убеждаемся, что shapeToUse не null для TypeScript
                                const nonNullShape: Shape = shapeToUse;
                                
                                const nearbyCheck = canPlaceShape(gameState.grid, nonNullShape, r, c);
                                if (nearbyCheck.valid) {
                                    handleCellClick(r, c);
                                    stopDragging();
                                    setGhostPosition(null);
                                    setHighlightedLines([]);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
                
            // Пробуем использовать ghostPosition если он есть
            if (ghostPosition && ghostPosition.valid) {
                handleCellClick(ghostPosition.row, ghostPosition.col);
                stopDragging();
                setGhostPosition(null);
                setHighlightedLines([]);
                return;
            }
                
            // Как запасной вариант, если ghostPosition не определен, пробуем найти позицию через draggingShape
            if (!ghostPosition && (gameState.selectedShape || selectedShapeRef.current) && gridRef.current && draggingShape) {
                // Если ghostPosition не определен, но перетаскивание завершилось,
                // попробуем найти ближайшую валидную позицию к текущей позиции курсора
                
                const gridRect = gridRef.current.getBoundingClientRect();
                if (draggingShape) {
                    // Предпочитаем использовать переданные clientX/Y, если они доступны
                    const x = clientX !== undefined ? clientX : draggingShape.currentX;
                    const y = clientY !== undefined ? clientY : draggingShape.currentY;
                    
                    // Проверяем, находится ли курсор где-то рядом с сеткой
                    if (
                        x >= gridRect.left - 50 &&
                        x <= gridRect.right + 50 &&
                        y >= gridRect.top - 50 &&
                        y <= gridRect.bottom + 50
                    ) {
                        // Пытаемся найти ближайшую подходящую позицию
                        
                        const cellSize = gridRect.width / gameState.grid[0].length;
                        let row = Math.floor((y - gridRect.top) / cellSize);
                        let col = Math.floor((x - gridRect.left) / cellSize);
                        
                        // Ограничиваем значения в пределах сетки
                        row = Math.max(0, Math.min(row, gameState.grid.length - 1));
                        col = Math.max(0, Math.min(col, gameState.grid[0].length - 1));
                        
                        // Проверяем эту позицию и соседние
                        for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, gameState.grid.length - 1); r++) {
                            for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, gameState.grid[0].length - 1); c++) {
                                const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                                
                                // Проверяем, что фигура существует
                                if (!shapeToUse) continue;
                                
                                // Убеждаемся, что shapeToUse не null для TypeScript
                                const nonNullShape: Shape = shapeToUse;
                                
                                const check = canPlaceShape(gameState.grid, nonNullShape, r, c);
                                if (check.valid) {
                                    // Размещаем фигуру
                                    handleCellClick(r, c);
                                    // После размещения выходим из функции, так как фигура уже размещена
                                    stopDragging();
                                    setGhostPosition(null);
                                    setHighlightedLines([]);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            
            // Эта секция никогда не выполнится, так как мы уже проверили ghostPosition выше
            // и, если он был валидным, функция бы завершилась
        } catch (error) {
            console.error("Error during drag end:", error);
        }
        
        // Финальный блок переносим в setTimeout для гарантированного завершения всех операций
        // Заметим, что мы НЕ сбрасываем стейты в finally
    }, [ghostPosition, gameState.selectedShape, gameState.grid, gridRef, draggingShape, handleCellClick, stopDragging, selectShape]);
    
    // Обработка начала перетаскивания
    const handleDragStart = useCallback((shapeId: string, clientX: number, clientY: number) => {
        const shape = shapes.find(s => s.id === shapeId);
        if (shape) {
            selectedShapeRef.current = shape;
            selectShape(shape);
            startDragging(shapeId, clientX, clientY);
            
            setTimeout(() => {
                handleDragMove(clientX, clientY);
            }, 0);
        }
    }, [shapes, selectShape, startDragging, handleDragMove]);
    
    // Обработка для просмотра рекламы (получение бонусных фигур)
    const handleWatchAd = useCallback(() => {
        addBonusShapes();
        // Здесь будет интеграция с SDK Яндекс Игр для показа рекламы
    }, [addBonusShapes]);
    
    // Обработка для шаринга результата
    const handleShare = useCallback(() => {
        if (onShare) {
            onShare(score);
        }
    }, [score, onShare]);
    
    return (
        <GameContainer>
            {/* Общий контейнер (адаптируется под мобильный и десктопный вид) */}
            <MobileLayoutContainer>
                {/* Мобильный вид - очки вверху */}
                <MobileScoreContainer>
                    <Score
                        currentScore={score}
                        highScore={highScore}
                        combo={combo}
                        comboMultiplier={comboMultiplier}
                        comboText={getCurrentComboText()}
                        isNewHighScore={isNewHighScore}
                        scoreAnimation={scoreAnimation}
                        horizontal={true} // Горизонтальное расположение для мобильного
                    />
                </MobileScoreContainer>
                
                {/* Единая игровая сетка для обоих видов */}
                <GridContainer ref={gridRef}>
                    <Grid
                        grid={gameState.grid}
                        selectedShape={gameState.selectedShape}
                        ghostPosition={ghostPosition}
                        highlightedLines={highlightedLines}
                        onCellClick={handleCellClick}
                    />
                </GridContainer>
                
                {/* Мобильный вид - фигуры внизу горизонтально */}
                <MobilePreviewContainer>
                    <Preview
                        shapes={shapes}
                        selectedShapeId={gameState.selectedShape?.id || null}
                        onShapeSelect={handleShapeSelect}
                        onShapeRotate={rotateShapeById}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={(x, y) => handleDragEnd(x, y)}
                        isDragging={!!draggingShape}
                        draggingShapeId={draggingShape?.shapeId || null}
                        dragPosition={draggingShape ? {
                            x: draggingShape.currentX,
                            y: draggingShape.currentY
                        } : null}
                        registerShapeRef={registerShapeRef}
                        horizontal={true}
                    />
                </MobilePreviewContainer>
            </MobileLayoutContainer>
            
            <SidePanel>
                {/* Десктопный вид - очки слева */}
                <DesktopScoreContainer>
                    <Score
                        currentScore={score}
                        highScore={highScore}
                        combo={combo}
                        comboMultiplier={comboMultiplier}
                        comboText={getCurrentComboText()}
                        isNewHighScore={isNewHighScore}
                        scoreAnimation={scoreAnimation}
                    />
                </DesktopScoreContainer>
                
                {/* Десктопный вид - фигуры слева вертикально */}
                <DesktopPreviewContainer>
                    <Preview
                        shapes={shapes}
                        selectedShapeId={gameState.selectedShape?.id || null}
                        onShapeSelect={handleShapeSelect}
                        onShapeRotate={rotateShapeById}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={(x, y) => handleDragEnd(x, y)}
                        isDragging={!!draggingShape}
                        draggingShapeId={draggingShape?.shapeId || null}
                        dragPosition={draggingShape ? {
                            x: draggingShape.currentX,
                            y: draggingShape.currentY
                        } : null}
                        registerShapeRef={registerShapeRef}
                        horizontal={false}
                    />
                </DesktopPreviewContainer>
            </SidePanel>
            
            {gameState.isGameOver && (
                <GameOverModal
                    score={score}
                    highScore={highScore}
                    isNewHighScore={isNewHighScore}
                    onRestart={handleRestart}
                    onWatchAd={handleWatchAd}
                    onShare={onShare ? handleShare : undefined}
                    onMenu={onMainMenu}
                />
            )}
        </GameContainer>
    );
};

export default GameController;