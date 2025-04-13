/**
 * Типы, связанные с фигурами
 */
import { ShapeType, ShapeOrientation } from './game';

/**
 * Структура определения фигуры
 */
export interface ShapeDefinition {
    type: ShapeType;
    matrices: {
        [ShapeOrientation.DEGREES_0]?: boolean[][];
        [ShapeOrientation.DEGREES_90]?: boolean[][];
        [ShapeOrientation.DEGREES_180]?: boolean[][];
        [ShapeOrientation.DEGREES_270]?: boolean[][];
    };
}

/**
 * Информация о валидности положения фигуры
 */
export interface ShapePosition {
    x: number;
    y: number;
    valid: boolean;
    willClearLines?: boolean;
}

/**
 * Вспомогательная информация о фигуре для системы Drag-and-Drop
 */
export interface DraggableShapeInfo {
    shapeId: string;
    initialX: number;
    initialY: number;
    startClientX: number;
    startClientY: number;
    currentClientX: number;
    currentClientY: number;
    isDragging: boolean;
    returningToOrigin?: boolean;
}

/**
 * Параметры для генерации фигур
 */
export interface ShapeGenerationParams {
    excludeTypes?: ShapeType[];
    forceTypes?: ShapeType[];
    colorOptions?: string[];
}