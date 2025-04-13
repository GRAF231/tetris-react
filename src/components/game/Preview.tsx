/**
 * Компонент для предпросмотра доступных фигур
 */
import React, { FC } from 'react';
import { Shape as ShapeType } from '../../types/game';
import Shape from './Shape';
import styled from 'styled-components';
import { GRID_BACKGROUND, GRID_BORDER } from '../../constants/colors';

// Стилизованные компоненты
const PreviewContainer = styled.div<{ $horizontal?: boolean }>`
    display: flex;
    flex-direction: ${props => props.$horizontal ? 'row' : 'column'};
    gap: 12px;
    width: 100%;
    max-width: ${props => props.$horizontal ? '100%' : '300px'};
    padding: 12px;
    background-color: ${GRID_BACKGROUND};
    border: 2px solid ${GRID_BORDER};
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    align-items: center;
`;

const PreviewTitle = styled.h3`
    font-size: 18px;
    margin: 0 0 8px 0;
    text-align: center;
    color: #333;
`;

const ShapesContainer = styled.div<{ $horizontal?: boolean }>`
    display: flex;
    flex-direction: ${props => props.$horizontal ? 'row' : 'column'};
    gap: ${props => props.$horizontal ? '12px' : '16px'};
    align-items: center;
    justify-content: ${props => props.$horizontal ? 'center' : 'flex-start'};
    height: ${props => props.$horizontal ? '110px' : 'unset'};
    width: 100%;
`;

const ShapeWrapper = styled.div<{ $horizontal: boolean; $isSelected: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    background-color: ${props => props.$isSelected ? 'rgba(100, 200, 255, 0.2)' : 'transparent'};
    border: 2px solid ${props => props.$isSelected ? 'rgba(100, 200, 255, 0.8)' : 'transparent'};
    transition: all 0.2s ease;
    cursor: pointer;
    width: ${props => props.$horizontal ? 'calc(33.3% - 8px);' : '100%'};
    flex-shrink: 0;
    &:hover {
        background-color: ${props => props.$isSelected ? 'rgba(100, 200, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
    }
`;

const NoShapesMessage = styled.div`
    padding: 16px;
    text-align: center;
    color: #666;
    font-style: italic;
`;

interface Props {
    shapes: ShapeType[];
    selectedShapeId: string | null;
    onShapeSelect: (shape: ShapeType) => void;
    onShapeRotate: (shapeId: string) => void;
    onDragStart: (shapeId: string, x: number, y: number) => void;
    onDragMove: (x: number, y: number) => void;
    onDragEnd: (x?: number, y?: number) => void;
    isDragging: boolean;
    draggingShapeId: string | null;
    dragPosition: { x: number; y: number } | null;
    registerShapeRef: (shapeId: string, element: HTMLDivElement | null) => void;
    horizontal?: boolean; // Новый параметр для горизонтального отображения
}

export const Preview: FC<Props> = ({
    shapes,
    selectedShapeId,
    onShapeSelect,
    onShapeRotate,
    onDragStart,
    onDragMove,
    onDragEnd,
    isDragging,
    draggingShapeId,
    dragPosition,
    registerShapeRef,
    horizontal = false
}) => {
    return (
        <PreviewContainer $horizontal={horizontal}>
            {!horizontal && <PreviewTitle>Доступные фигуры</PreviewTitle>}
            
            {shapes.length > 0 ? (
                <ShapesContainer $horizontal={horizontal}>
                    {shapes.map(shape => (
                        <ShapeWrapper
                            key={shape.id}
                            $horizontal={horizontal}
                            $isSelected={selectedShapeId === shape.id}
                            onClick={() => onShapeSelect(shape)}
                        >
                            <Shape
                                shape={shape}
                                draggable={true}
                                isDragging={isDragging && draggingShapeId === shape.id}
                                dragPosition={
                                    isDragging && draggingShapeId === shape.id && dragPosition
                                        ? dragPosition
                                        : undefined
                                }
                                onDragStart={onDragStart}
                                onDragMove={onDragMove}
                                onDragEnd={onDragEnd}
                                onRotate={onShapeRotate}
                                registerRef={registerShapeRef}
                            />
                        </ShapeWrapper>
                    ))}
                </ShapesContainer>
            ) : (
                <NoShapesMessage>Нет доступных фигур</NoShapesMessage>
            )}
        </PreviewContainer>
    );
};

export default Preview;