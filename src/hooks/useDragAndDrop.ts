/**
 * Хук для управления перетаскиванием фигур на игровую сетку
 */
import { useCallback, useRef } from 'react';
import { Shape } from '../types/game';
import { DraggableShapeInfo } from '../types/shapes';

interface DragAndDropHandlers {
    handleDragStart: (shapeId: string, clientX: number, clientY: number) => void;
    handleDragMove: (clientX: number, clientY: number) => void;
    handleDragEnd: (clientX?: number, clientY?: number) => void;
}

interface UseDragAndDropProps {
    shapes: Shape[];
    draggingShape: DraggableShapeInfo | null;
    gameGrid: Array<Array<{ filled: boolean; color?: string; id?: string }>>;
    selectedShape: Shape | null;
    selectShape: (shape: Shape) => void;
    startDragging: (shapeId: string, clientX: number, clientY: number) => void;
    handleDragging: (clientX: number, clientY: number) => void;
    stopDragging: () => void;
    onPlaceShape: (row: number, col: number, shape: Shape | null) => void;
    resetGhostPosition: () => void;
    updateGhostPosition: (row: number, col: number, shape?: Shape | null) => void;
    gridRef: React.RefObject<HTMLDivElement | null>;
}

export function useDragAndDrop({
    shapes,
    draggingShape,
    gameGrid,
    selectedShape,
    selectShape,
    startDragging,
    handleDragging,
    stopDragging,
    onPlaceShape,
    resetGhostPosition,
    updateGhostPosition,
    gridRef,
}: UseDragAndDropProps): DragAndDropHandlers {
    const selectedShapeRef = useRef<Shape | null>(null);

    const handleDragMove = useCallback(
        (clientX: number, clientY: number) => {
            handleDragging(clientX, clientY);

            if (!gridRef.current) return;

            const effectiveShape = selectedShape || selectedShapeRef.current;

            if (!effectiveShape && draggingShape && shapes.length > 0) {
                const draggedShape = shapes.find((s) => s.id === draggingShape.shapeId);
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
                    const cellSize = gridRect.width / gameGrid[0].length;
                    let row = Math.floor((clientY - gridRect.top) / cellSize);
                    let col = Math.floor((clientX - gridRect.left) / cellSize);

                    row = Math.max(0, Math.min(row, gameGrid.length - 1));
                    col = Math.max(0, Math.min(col, gameGrid[0].length - 1));
                    updateGhostPosition(row, col, shapeToUse);
                } else {
                    resetGhostPosition();
                }
            } catch (error) {
                console.error('Error during drag move:', error);
            }
        },
        [
            selectedShape,
            gameGrid,
            handleDragging,
            draggingShape,
            shapes,
            selectShape,
            resetGhostPosition,
            updateGhostPosition,
            gridRef,
        ]
    );

    const handleDragEnd = useCallback(
        (clientX?: number, clientY?: number) => {
            const effectiveShape = selectedShape || selectedShapeRef.current;

            // Если нет выбранной фигуры, но есть перетаскиваемая, находим её
            if (!effectiveShape && draggingShape && shapes.length > 0) {
                const draggedShape = shapes.find((s) => s.id === draggingShape.shapeId);
                if (draggedShape) {
                    selectedShapeRef.current = draggedShape;
                    selectShape(draggedShape);
                }
            }

            if (
                clientX !== undefined &&
                clientY !== undefined &&
                (selectedShape || selectedShapeRef.current) &&
                gridRef.current
            ) {
                const gridRect = gridRef.current.getBoundingClientRect();
                const buffer = 20;

                if (
                    clientX >= gridRect.left - buffer &&
                    clientX <= gridRect.right + buffer &&
                    clientY >= gridRect.top - buffer &&
                    clientY <= gridRect.bottom + buffer
                ) {
                    const cellSize = gridRect.width / gameGrid[0].length;
                    let row = Math.floor((clientY - gridRect.top) / cellSize);
                    let col = Math.floor((clientX - gridRect.left) / cellSize);

                    row = Math.max(0, Math.min(row, gameGrid.length - 1));
                    col = Math.max(0, Math.min(col, gameGrid[0].length - 1));

                    const shapeToUse = selectedShape || selectedShapeRef.current;

                    if (!shapeToUse) return;

                    onPlaceShape(row, col, shapeToUse);
                    setTimeout(() => {
                        stopDragging();
                        resetGhostPosition();
                        selectedShapeRef.current = null;
                    }, 50);
                } else {
                    stopDragging();
                    resetGhostPosition();
                    selectedShapeRef.current = null;
                }
            } else {
                stopDragging();
                resetGhostPosition();
                selectedShapeRef.current = null;
            }
        },
        [
            shapes,
            selectedShape,
            gameGrid,
            gridRef,
            draggingShape,
            onPlaceShape,
            stopDragging,
            resetGhostPosition,
            selectShape,
        ]
    );

    const handleDragStart = useCallback(
        (shapeId: string, clientX: number, clientY: number) => {
            const shape = shapes.find((s) => s.id === shapeId);
            if (shape) {
                selectedShapeRef.current = shape;
                selectShape(shape);
                startDragging(shapeId, clientX, clientY);

                setTimeout(() => {
                    handleDragMove(clientX, clientY);
                }, 0);
            }
        },
        [shapes, selectShape, startDragging, handleDragMove]
    );

    return {
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
}
