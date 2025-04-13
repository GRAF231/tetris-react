/**
 * Компонент для отображения и перетаскивания фигур
 */
import React, { FC, useRef, useEffect } from 'react';
import { Shape as ShapeType } from '../../types/game';
import styled from 'styled-components';

// Стилизованные компоненты
const ShapeContainer = styled.div<{ 
    $draggable: boolean;
    $isDragging: boolean;
    $width: number;
    $height: number;
    $positionX?: number;
    $positionY?: number;
}>`
    display: grid;
    gap: 2px;
    background-color: transparent;
    width: ${props => props.$width * 30}px;
    height: ${props => props.$height * 30}px;
    position: ${props => props.$isDragging ? 'fixed' : 'relative'};
    ${props => props.$isDragging && `
        top: ${props.$positionY}px;
        left: ${props.$positionX}px;
        transform: translate(-50%, -50%);
        z-index: 1000;
        pointer-events: none;
    `}
    cursor: ${props => props.$draggable ? 'grab' : 'default'};
    touch-action: none;
    user-select: none;
    transition: transform 0.1s ease, box-shadow 0.1s ease;

    &:hover {
        transform: ${props => !props.$isDragging && props.$draggable ? 'scale(1.05)' : 'none'};
        box-shadow: ${props => !props.$isDragging && props.$draggable ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none'};
    }

    &:active {
        cursor: ${props => props.$draggable ? 'grabbing' : 'default'};
    }
`;

const ShapeGrid = styled.div<{ columns: number; rows: number }>`
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-template-rows: repeat(${props => props.rows}, 1fr);
    gap: 2px;
    width: 100%;
    height: 100%;
`;

const ShapeCell = styled.div<{ filled: boolean; color: string }>`
    background-color: ${props => props.filled ? props.color : 'transparent'};
    border-radius: 4px;
    aspect-ratio: 1/1;
    box-shadow: ${props => props.filled ? 'inset 0 2px 2px rgba(255, 255, 255, 0.5), inset 0 -2px 2px rgba(0, 0, 0, 0.2)' : 'none'};
    border: ${props => props.filled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
`;


interface Props {
    shape: ShapeType;
    draggable?: boolean;
    isDragging?: boolean;
    dragPosition?: { x: number; y: number };
    onDragStart?: (shapeId: string, x: number, y: number) => void;
    onDragMove?: (x: number, y: number) => void;
    onDragEnd?: (x?: number, y?: number) => void;
    onRotate?: (shapeId: string) => void;
    registerRef?: (shapeId: string, element: HTMLDivElement | null) => void;
}

export const Shape: FC<Props> = ({
    shape,
    draggable = false,
    isDragging = false,
    dragPosition,
    onDragStart,
    onDragMove,
    onDragEnd,
    onRotate,
    registerRef
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Устанавливаем размеры сетки
    const rows = shape.matrix.length;
    const columns = shape.matrix[0]?.length || 0;
    
    // Обработчики событий для перетаскивания
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!draggable || !onDragStart) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Сначала селектим фигуру и сразу же начинаем драг
        onDragStart(shape.id, e.clientX, e.clientY);
        
        // Добавляем глобальные обработчики
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!draggable || !onDragStart) return;
        
        const touch = e.touches[0];
        
        // Сначала селектим фигуру и сразу же начинаем драг
        onDragStart(shape.id, touch.clientX, touch.clientY);
        
        // Для мобильных устройств можно использовать e.stopPropagation()
        // без preventDefault, чтобы избежать проблем с пассивными слушателями
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
        
        // Останавливаем распространение события, но не используем preventDefault
        e.stopPropagation();
    };
    
    const handleMouseUp = (e: MouseEvent) => {
        try {
            if (!onDragEnd) {
                return;
            }
            
            // Явно указываем координаты курсора при завершении перетаскивания
            onDragEnd(e.clientX, e.clientY);
        } catch (error) {
            console.error("Error in handleMouseUp:", error);
        } finally {
            // Удаляем глобальные обработчики в блоке finally, чтобы они точно были удалены
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        try {
            if (!onDragEnd) {
                return;
            }
            
            // Используем последнюю известную позицию касания, если возможно
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                onDragEnd(touch.clientX, touch.clientY);
            } else {
                onDragEnd();
            }
        } catch (error) {
            console.error("Error in handleTouchEnd:", error);
        }
    };
    
    // Регистрируем ссылку на DOM-элемент
    useEffect(() => {
        if (registerRef && containerRef.current) {
            registerRef(shape.id, containerRef.current);
        }
    }, [shape.id, registerRef]);
    
    return (
        <ShapeContainer
            ref={containerRef}
            $draggable={draggable}
            $isDragging={isDragging}
            $width={columns}
            $height={rows}
            $positionX={dragPosition?.x}
            $positionY={dragPosition?.y}
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