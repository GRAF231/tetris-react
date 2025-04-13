/**
 * Компонент для отображения и перетаскивания фигур
 */
import React, { FC, useRef, useEffect } from 'react';
import { Shape as ShapeType } from '../../types/game';
import { ShapeContainer, ShapeGrid, ShapeCell } from './Shape.styles';

interface Props {
    shape: ShapeType;
    draggable?: boolean;
    isDragging?: boolean;
    dragPosition?: {
        x: number;
        y: number;
        initialX?: number;
        initialY?: number;
        startX?: number;
        startY?: number;
    };
    onDragStart?: (shapeId: string, x: number, y: number) => void;
    onDragMove?: (x: number, y: number) => void;
    onDragEnd?: (x?: number, y?: number) => void;
    registerRef?: (shapeId: string, element: HTMLDivElement | null) => void;
    returningToOrigin?: boolean;
}

export const Shape: FC<Props> = ({
    shape,
    draggable = false,
    isDragging = false,
    dragPosition,
    onDragStart,
    onDragMove,
    onDragEnd,
    registerRef,
    returningToOrigin = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rows = shape.matrix.length;
    const columns = shape.matrix[0]?.length || 0;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!draggable || !onDragStart) return;

        if (returningToOrigin) return;

        e.preventDefault();
        e.stopPropagation();
        onDragStart(shape.id, e.clientX, e.clientY);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!draggable || !onDragStart) return;

        if (returningToOrigin) return;

        const touch = e.touches[0];
        onDragStart(shape.id, touch.clientX, touch.clientY);

        e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!onDragMove) return;
        onDragMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!onDragMove) return;
        const touch = e.touches[0];
        onDragMove(touch.clientX, touch.clientY);

        e.stopPropagation();
    };

    const handleMouseUp = (e: MouseEvent) => {
        try {
            if (!onDragEnd) {
                return;
            }

            onDragEnd(e.clientX, e.clientY);
        } catch (error) {
            console.error('Error in handleMouseUp:', error);
        } finally {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        try {
            if (!onDragEnd) {
                return;
            }

            if (e.changedTouches && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                onDragEnd(touch.clientX, touch.clientY);
            } else {
                onDragEnd();
            }
        } catch (error) {
            console.error('Error in handleTouchEnd:', error);
        }
    };

    useEffect(() => {
        if (registerRef && containerRef.current) {
            registerRef(shape.id, containerRef.current);
        }
    }, [shape.id, registerRef]);

    useEffect(() => {
        if (returningToOrigin) {
            console.log('Shape returning to origin:', shape.id, dragPosition);
        }
    }, [returningToOrigin, shape.id, dragPosition]);

    // Рассчитываем смещение для трансформации
    const calculateTranslation = () => {
        if (!dragPosition) return { x: 0, y: 0 };

        const { x: currentX, y: currentY, startX = 0, startY = 0 } = dragPosition;

        if (returningToOrigin) {
            // Если возвращаемся в исходное положение - смещение 0
            return { x: 0, y: 0 };
        } else if (isDragging) {
            // Во время перетаскивания - разница между текущей и начальной позициями курсора
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            return { x: deltaX, y: deltaY };
        }

        return { x: 0, y: 0 };
    };

    const { x: translateX, y: translateY } = calculateTranslation();

    return (
        <ShapeContainer
            ref={containerRef}
            $draggable={draggable}
            $isDragging={isDragging}
            $width={columns}
            $height={rows}
            $translateX={translateX}
            $translateY={translateY}
            $returningToOrigin={returningToOrigin}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <ShapeGrid columns={columns} rows={rows}>
                {shape.matrix.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <ShapeCell
                            key={`${rowIndex}-${colIndex}`}
                            filled={!!cell}
                            color={shape.color}
                        />
                    ))
                )}
            </ShapeGrid>
        </ShapeContainer>
    );
};

export default Shape;
