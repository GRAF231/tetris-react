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
    const [shapes, setShapes] = useState<Shape[]>(
        initialShapes || generateRandomShapes(AVAILABLE_SHAPES_COUNT)
    );
    
    const [draggingShape, setDraggingShape] = useState<DraggableShapeInfo | null>(null);
    
    useEffect(() => {
        if (initialShapes) {
            console.log("Updating shapes from initialShapes:", initialShapes);
            setShapes(initialShapes);
        }
    }, [initialShapes]);
    
    const shapeRefs = useRef<Record<string, HTMLElement | null>>({});
    
    const generateNewShapes = useCallback((count: number = AVAILABLE_SHAPES_COUNT) => {
        const newShapes = generateRandomShapes(count);
        setShapes(newShapes);
        return newShapes;
    }, []);
    
    const replaceShape = useCallback((shapeId: string) => {
        setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === shapeId);
            if (index === -1) return prev;
            
            const newShapes = [...prev];
            newShapes[index] = generateRandomShapes(1)[0];
            return newShapes;
        });
    }, []);
    
    const rotateShapeById = useCallback((shapeId: string) => {
        setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === shapeId);
            if (index === -1) return prev;
            
            const newShapes = [...prev];
            newShapes[index] = rotateShape(prev[index]);
            return newShapes;
        });
    }, []);
    
    const registerShapeRef = useCallback((shapeId: string, element: HTMLElement | null) => {
        shapeRefs.current[shapeId] = element;
    }, []);
    
    const startDragging = useCallback((shapeId: string, clientX: number, clientY: number) => {
        const shape = shapes.find(s => s.id === shapeId);
        if (!shape) return;
        
        const element = shapeRefs.current[shapeId];
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        
        // Начальные координаты элемента и позиция клика
        setDraggingShape({
            shapeId,
            initialX: rect.left,
            initialY: rect.top,
            startClientX: clientX,
            startClientY: clientY,
            currentClientX: clientX,
            currentClientY: clientY,
            isDragging: true
        });
    }, [shapes]);

    const handleDragging = useCallback((clientX: number, clientY: number) => {
        setDraggingShape(prev => {
            if (!prev) return null;
            
            return {
                ...prev,
                currentClientX: clientX,
                currentClientY: clientY
            };
        });
    }, []);

    const stopDragging = useCallback(() => {
        // Сначала отмечаем, что фигура должна вернуться, но не меняем координаты
        setDraggingShape(prev => {
            if (!prev) return null;
            
            // Просто меняем флаги
            return {
                ...prev,
                isDragging: false,
                returningToOrigin: true
            };
        });
        
        // Затем через небольшую задержку устанавливаем конечные координаты для анимации
        setTimeout(() => {
            setDraggingShape(prev => {
                if (!prev) return null;
                
                // Теперь задаем целевые координаты для анимации (возврат в исходное положение)
                return {
                    ...prev,
                    currentClientX: prev.startClientX,
                    currentClientY: prev.startClientY
                };
            });
            
            // И через время анимации полностью убираем состояние перетаскивания
            setTimeout(() => {
                setDraggingShape(null);
            }, 300);
        }, 10);
    }, []);
    
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