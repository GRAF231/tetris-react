/**
 * Хук для управления фигурами и их перемещением
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Shape } from '../types/game';
import { DraggableShapeInfo } from '../types/shapes';
import { generateRandomShapes, rotateShape } from '../core/shapeGenerator';
import { AVAILABLE_SHAPES_COUNT } from '../constants/gameConfig';

/**
 * Хук для управления фигурами в игре
 */
export function useShapes(initialShapes?: Shape[]) {
    // Состояние для доступных фигур
    const [shapes, setShapes] = useState<Shape[]>(
        initialShapes || generateRandomShapes(AVAILABLE_SHAPES_COUNT)
    );
    
    // Состояние для текущей перетаскиваемой фигуры
    const [draggingShape, setDraggingShape] = useState<DraggableShapeInfo | null>(null);
    
    // Обновляем shapes, когда initialShapes меняется
    // Это критически важно, чтобы компонент Preview обновлялся когда доступные фигуры меняются
    useEffect(() => {
        if (initialShapes) {
            console.log("Updating shapes from initialShapes:", initialShapes);
            setShapes(initialShapes);
        }
    }, [initialShapes]);
    
    // Ссылка на элемент фигуры для обработки перетаскивания
    const shapeRefs = useRef<Record<string, HTMLElement | null>>({});
    
    // Генерация новых фигур
    const generateNewShapes = useCallback((count: number = AVAILABLE_SHAPES_COUNT) => {
        const newShapes = generateRandomShapes(count);
        setShapes(newShapes);
        return newShapes;
    }, []);
    
    // Замена одной фигуры после её использования
    const replaceShape = useCallback((shapeId: string) => {
        setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === shapeId);
            if (index === -1) return prev;
            
            const newShapes = [...prev];
            newShapes[index] = generateRandomShapes(1)[0];
            return newShapes;
        });
    }, []);
    
    // Вращение фигуры
    const rotateShapeById = useCallback((shapeId: string) => {
        setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === shapeId);
            if (index === -1) return prev;
            
            const newShapes = [...prev];
            newShapes[index] = rotateShape(prev[index]);
            return newShapes;
        });
    }, []);
    
    // Регистрация DOM-ссылки для фигуры
    const registerShapeRef = useCallback((shapeId: string, element: HTMLElement | null) => {
        shapeRefs.current[shapeId] = element;
    }, []);
    
    // Начало перетаскивания фигуры
    const startDragging = useCallback((shapeId: string, clientX: number, clientY: number) => {
        const shape = shapes.find(s => s.id === shapeId);
        if (!shape) return;
        
        const element = shapeRefs.current[shapeId];
        if (!element) return;
        
        // Получаем позицию элемента
        const rect = element.getBoundingClientRect();
        
        setDraggingShape({
            shapeId,
            initialX: rect.left,
            initialY: rect.top,
            currentX: clientX,
            currentY: clientY,
            isDragging: true
        });
    }, [shapes]);
    
    // Обработка перетаскивания фигуры
    const handleDragging = useCallback((clientX: number, clientY: number) => {
        setDraggingShape(prev => {
            if (!prev) return null;
            
            return {
                ...prev,
                currentX: clientX,
                currentY: clientY
            };
        });
    }, []);
    
    // Завершение перетаскивания фигуры
    const stopDragging = useCallback(() => {
        setDraggingShape(null);
    }, []);
    
    // Получение фигуры по её ID
    const getShapeById = useCallback((shapeId: string) => {
        return shapes.find(shape => shape.id === shapeId);
    }, [shapes]);
    
    return {
        shapes,
        draggingShape,
        registerShapeRef,
        startDragging,
        handleDragging,
        stopDragging,
        generateNewShapes,
        replaceShape,
        rotateShapeById,
        getShapeById
    };
}