/**
 * Контроллер игры, объединяющий все компоненты
 */
import { FC, useEffect, useState, useCallback, useRef } from 'react';
import Grid from './Grid';
import Preview from './Preview';
import Score from './Score';
import GameOverModal from './GameOverModal';
import { useGameState } from '../../hooks/useGameState';
import { useShapes } from '../../hooks/useShapes';
import { useScore } from '../../hooks/useScore';
import { Shape, PlacementCheck } from '../../types/game';
import { canPlaceShape } from '../../core/gameLogic';
import {
    GameContainer,
    GridContainer,
    SidePanel,
    MobileLayoutContainer,
    MobileScoreContainer,
    MobilePreviewContainer,
    DesktopPreviewContainer,
    DesktopScoreContainer
} from './GameController.styles';

interface Props {
    onShare?: (score: number) => void;
    onMainMenu?: () => void;
}

export const GameController: FC<Props> = ({ onShare, onMainMenu }) => {
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
        scoreAnimation,
        showScoreAnimation,
        addPoints
    } = useScore();
    
    const selectedShapeRef = useRef<Shape | null>(null);
    
    const [ghostPosition, setGhostPosition] = useState<{
        row: number;
        col: number;
        valid: boolean;
    } | null>(null);
    
    const [highlightedLines, setHighlightedLines] = useState<Array<{
        type: 'row' | 'column';
        index: number;
    }>>([]);
    
    const gridRef = useRef<HTMLDivElement>(null);
    
    const handleRestart = useCallback(() => {
        startNewGame();
        resetScore();
        setGhostPosition(null);
        setHighlightedLines([]);
    }, [startNewGame, resetScore]);
    
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
            
            if (check.linesWillBeFilled && gridRef.current) {
                const gridRect = gridRef.current.getBoundingClientRect();
                const centerX = gridRect.left + gridRect.width / 2;
                const centerY = gridRect.top + gridRect.height / 2;
                
                const rowsCount = check.linesWillBeFilled.rows.length;
                const colsCount = check.linesWillBeFilled.cols.length;
                const cellsCount = rowsCount * gameState.grid[0].length +
                                  colsCount * gameState.grid.length -
                                  (rowsCount * colsCount);
                
                addPoints(rowsCount, colsCount, cellsCount);
                
                updateScoreState({
                    currentScore: score,
                    highScore: highScore,
                    combo: combo,
                    comboMultiplier: comboMultiplier,
                    lastClearedCells: cellsCount
                });
                
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

    const lastGhostPositionRef = useRef<{row: number, col: number, valid: boolean} | null>(null);
    
    useEffect(() => {
        if (ghostPosition) {
            lastGhostPositionRef.current = ghostPosition;
        }
    }, [ghostPosition]);

    const handleDragEnd = useCallback((clientX?: number, clientY?: number) => {
        const effectiveShape = gameState.selectedShape || selectedShapeRef.current;

        if (!effectiveShape && draggingShape && shapes.length > 0) {
            console.log("No selected shape, but dragging is active. Trying to find shape by ID:", draggingShape.shapeId);
            const draggedShape = shapes.find(s => s.id === draggingShape.shapeId);
            if (draggedShape) {
                console.log("Found shape by ID, selecting it now:", draggedShape);
                selectedShapeRef.current = draggedShape;
                selectShape(draggedShape);
            }
        }
        
        try {
            if (clientX !== undefined && clientY !== undefined && (gameState.selectedShape || selectedShapeRef.current) && gridRef.current) {
                const gridRect = gridRef.current.getBoundingClientRect();
                const buffer = 20;
                
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
                    
                    console.log("Calculated grid position from coordinates:", { row, col });
                    
                    const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                    
                    if (!shapeToUse) {
                        console.log("No shape available for placement check");
                        return;
                    }
                    
                    const nonNullShape: Shape = shapeToUse;
                    
                    const check = canPlaceShape(
                        gameState.grid,
                        nonNullShape,
                        row,
                        col
                    );
                    
                    if (check.valid) {
                        handleCellClick(row, col);
                        setTimeout(() => {
                            stopDragging();
                            setGhostPosition(null);
                            setHighlightedLines([]);
                            selectedShapeRef.current = null;
                        }, 50);
                        return;
                    } else {
                        for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, gameState.grid.length - 1); r++) {
                            for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, gameState.grid[0].length - 1); c++) {
                                const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                                
                                if (!shapeToUse) continue;
                                
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
                
            if (ghostPosition && ghostPosition.valid) {
                handleCellClick(ghostPosition.row, ghostPosition.col);
                stopDragging();
                setGhostPosition(null);
                setHighlightedLines([]);
                return;
            }
                
            if (!ghostPosition && (gameState.selectedShape || selectedShapeRef.current) && gridRef.current && draggingShape) {
                
                const gridRect = gridRef.current.getBoundingClientRect();
                if (draggingShape) {
                    const x = clientX !== undefined ? clientX : draggingShape.currentClientX;
                    const y = clientY !== undefined ? clientY : draggingShape.currentClientY;
                    
                    if (
                        x >= gridRect.left - 50 &&
                        x <= gridRect.right + 50 &&
                        y >= gridRect.top - 50 &&
                        y <= gridRect.bottom + 50
                    ) { 
                        const cellSize = gridRect.width / gameState.grid[0].length;
                        let row = Math.floor((y - gridRect.top) / cellSize);
                        let col = Math.floor((x - gridRect.left) / cellSize);
                        
                        row = Math.max(0, Math.min(row, gameState.grid.length - 1));
                        col = Math.max(0, Math.min(col, gameState.grid[0].length - 1));
                        
                        for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, gameState.grid.length - 1); r++) {
                            for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, gameState.grid[0].length - 1); c++) {
                                const shapeToUse = gameState.selectedShape || selectedShapeRef.current;
                                
                                if (!shapeToUse) continue;
                                
                                const nonNullShape: Shape = shapeToUse;
                                
                                const check = canPlaceShape(gameState.grid, nonNullShape, r, c);
                                if (check.valid) {
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
            
            // Если после всех проверок мы не смогли разместить фигуру,
            // просто останавливаем перетаскивание и анимируем её возврат на место
            stopDragging();
            setGhostPosition(null);
            setHighlightedLines([]);
        } catch (error) {
            console.error("Error during drag end:", error);
            stopDragging();
            setGhostPosition(null);
            setHighlightedLines([]);
        }
    }, [ghostPosition, gameState.selectedShape, gameState.grid, gridRef, draggingShape, handleCellClick, stopDragging, selectShape]);
    
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
    
    const handleWatchAd = useCallback(() => {
        addBonusShapes();
    }, [addBonusShapes]);
    
    const handleShare = useCallback(() => {
        if (onShare) {
            onShare(score);
        }
    }, [score, onShare]);
    
    return (
        <GameContainer>
            <MobileLayoutContainer>
                <MobileScoreContainer>
                    <Score
                        currentScore={score}
                        highScore={highScore}
                        combo={combo}
                        comboMultiplier={comboMultiplier}
                        comboText={getCurrentComboText()}
                        isNewHighScore={isNewHighScore}
                        scoreAnimation={scoreAnimation}
                        horizontal={true}
                    />
                </MobileScoreContainer>
                
                <GridContainer ref={gridRef}>
                    <Grid
                        grid={gameState.grid}
                        selectedShape={gameState.selectedShape}
                        ghostPosition={ghostPosition}
                        highlightedLines={highlightedLines}
                        onCellClick={handleCellClick}
                    />
                </GridContainer>
                
                <MobilePreviewContainer>
                    <Preview
                        shapes={shapes}
                        selectedShapeId={gameState.selectedShape?.id || null}
                        onShapeSelect={handleShapeSelect}
                        onShapeRotate={rotateShapeById}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={(x, y) => handleDragEnd(x, y)}
                        isDragging={!!draggingShape && draggingShape.isDragging}
                        draggingShapeId={draggingShape?.shapeId || null}
                        dragPosition={draggingShape ? {
                            x: draggingShape.currentClientX,
                            y: draggingShape.currentClientY,
                            initialX: draggingShape.initialX,
                            initialY: draggingShape.initialY,
                            startX: draggingShape.startClientX,
                            startY: draggingShape.startClientY
                        } : null}
                        registerShapeRef={registerShapeRef}
                        horizontal={true}
                        returningToOrigin={!!draggingShape && !!draggingShape.returningToOrigin}
                    />
                </MobilePreviewContainer>
            </MobileLayoutContainer>
            
            <SidePanel>
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
                
                <DesktopPreviewContainer>
                    <Preview
                        shapes={shapes}
                        selectedShapeId={gameState.selectedShape?.id || null}
                        onShapeSelect={handleShapeSelect}
                        onShapeRotate={rotateShapeById}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={(x, y) => handleDragEnd(x, y)}
                        isDragging={!!draggingShape && draggingShape.isDragging}
                        draggingShapeId={draggingShape?.shapeId || null}
                        dragPosition={draggingShape ? {
                            x: draggingShape.currentClientX,
                            y: draggingShape.currentClientY,
                            initialX: draggingShape.initialX,
                            initialY: draggingShape.initialY,
                            startX: draggingShape.startClientX,
                            startY: draggingShape.startClientY
                        } : null}
                        registerShapeRef={registerShapeRef}
                        horizontal={false}
                        returningToOrigin={!!draggingShape && !!draggingShape.returningToOrigin}
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