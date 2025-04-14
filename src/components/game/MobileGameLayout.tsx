import React, { FC } from 'react';
import { Shape } from '../../types/game';
import Grid from './Grid';
import Preview from './Preview';
import Score from './Score';
import {
    MobileLayoutContainer,
    MobileScoreContainer,
    MobilePreviewContainer,
    GridContainer,
} from './GameController.styles';

interface MobileGameLayoutProps {
    grid: Array<Array<{ filled: boolean; color?: string; id?: string }>>;
    shapes: Shape[];
    score: number;
    highScore: number;
    combo: number;
    comboMultiplier: number;
    comboText: string;
    isNewHighScore: boolean;
    scoreAnimation: {
        points: number;
        visible: boolean;
        x: number;
        y: number;
    } | null;
    selectedShape: Shape | null;
    selectedShapeId: string | null;
    ghostPosition: { row: number; col: number; valid: boolean } | null;
    highlightedLines: Array<{ type: 'row' | 'column'; index: number }>;
    draggingShape: {
        shapeId: string;
        isDragging: boolean;
        currentClientX: number;
        currentClientY: number;
        initialX: number;
        initialY: number;
        startClientX: number;
        startClientY: number;
        returningToOrigin?: boolean;
    } | null;
    gridRef: React.RefObject<HTMLDivElement | null>;
    onCellClick: (row: number, col: number, shape: Shape | null) => void;
    onShapeSelect: (shape: Shape) => void;
    onShapeRotate: (shapeId: string) => void;
    onDragStart: (shapeId: string, clientX: number, clientY: number) => void;
    onDragMove: (clientX: number, clientY: number) => void;
    onDragEnd: (clientX?: number, clientY?: number) => void;
    registerShapeRef: (shapeId: string, element: HTMLElement | null) => void;
}

/**
 * Компонент для отображения игры на мобильных устройствах
 */
export const MobileGameLayout: FC<MobileGameLayoutProps> = ({
    grid,
    shapes,
    score,
    highScore,
    combo,
    comboMultiplier,
    comboText,
    isNewHighScore,
    scoreAnimation,
    selectedShape,
    selectedShapeId,
    ghostPosition,
    highlightedLines,
    draggingShape,
    gridRef,
    onCellClick,
    onShapeSelect,
    onShapeRotate,
    onDragStart,
    onDragMove,
    onDragEnd,
    registerShapeRef,
}) => {
    return (
        <MobileLayoutContainer>
            <MobileScoreContainer>
                <Score
                    currentScore={score}
                    highScore={highScore}
                    combo={combo}
                    comboMultiplier={comboMultiplier}
                    comboText={comboText}
                    isNewHighScore={isNewHighScore}
                    scoreAnimation={scoreAnimation}
                    horizontal={true}
                />
            </MobileScoreContainer>

            <GridContainer>
                <Grid
                    grid={grid}
                    gridRef={gridRef}
                    selectedShape={selectedShape}
                    ghostPosition={ghostPosition}
                    highlightedLines={highlightedLines}
                    onCellClick={onCellClick}
                />
            </GridContainer>

            <MobilePreviewContainer>
                <Preview
                    shapes={shapes}
                    selectedShapeId={selectedShapeId}
                    onShapeSelect={onShapeSelect}
                    onShapeRotate={onShapeRotate}
                    onDragStart={onDragStart}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    isDragging={!!draggingShape && draggingShape.isDragging}
                    draggingShapeId={draggingShape?.shapeId || null}
                    dragPosition={
                        draggingShape
                            ? {
                                  x: draggingShape.currentClientX,
                                  y: draggingShape.currentClientY,
                                  initialX: draggingShape.initialX,
                                  initialY: draggingShape.initialY,
                                  startX: draggingShape.startClientX,
                                  startY: draggingShape.startClientY,
                              }
                            : null
                    }
                    registerShapeRef={registerShapeRef}
                    horizontal={true}
                    returningToOrigin={!!draggingShape && !!draggingShape.returningToOrigin}
                />
            </MobilePreviewContainer>
        </MobileLayoutContainer>
    );
};

export default MobileGameLayout;
