/**
 * Компонент для предпросмотра доступных фигур
 */
import React, { FC } from 'react';
import { Shape as ShapeType } from '../../types/game';
import Shape from './Shape';
import {
    PreviewContainer,
    PreviewTitle,
    ShapesContainer,
    ShapeWrapper,
    NoShapesMessage,
} from './Preview.styles';

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
    dragPosition: {
        x: number;
        y: number;
        initialX?: number;
        initialY?: number;
        startX?: number;
        startY?: number;
    } | null;
    registerShapeRef: (shapeId: string, element: HTMLDivElement | null) => void;
    horizontal?: boolean;
    returningToOrigin?: boolean;
}

export const Preview: FC<Props> = ({
    shapes,
    selectedShapeId,
    onShapeSelect,
    onDragStart,
    onDragMove,
    onDragEnd,
    isDragging,
    draggingShapeId,
    dragPosition,
    registerShapeRef,
    horizontal = false,
    returningToOrigin = false,
}) => {
    return (
        <PreviewContainer $horizontal={horizontal}>
            {!horizontal && <PreviewTitle>Доступные фигуры</PreviewTitle>}

            {shapes.length > 0 ? (
                <ShapesContainer $horizontal={horizontal}>
                    {shapes.map((shape) => (
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
                                        ? {
                                              x: dragPosition.x,
                                              y: dragPosition.y,
                                              initialX: dragPosition.initialX,
                                              initialY: dragPosition.initialY,
                                              startX: dragPosition.startX,
                                              startY: dragPosition.startY,
                                          }
                                        : undefined
                                }
                                onDragStart={onDragStart}
                                onDragMove={onDragMove}
                                onDragEnd={onDragEnd}
                                registerRef={registerShapeRef}
                                returningToOrigin={
                                    returningToOrigin && draggingShapeId === shape.id
                                }
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
