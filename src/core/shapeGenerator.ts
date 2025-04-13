/**
 * Генератор фигур для игры "Тетрис-блоки"
 */
import { v4 as uuidv4 } from 'uuid';
import { Shape, ShapeType, ShapeOrientation } from '../types/game';
import { ShapeDefinition, ShapeGenerationParams } from '../types/shapes';
import { SHAPE_COLORS, SHAPE_GENERATION_WEIGHTS } from '../constants/gameConfig';

/**
 * Определения всех типов фигур с их возможными ориентациями
 */
const shapeDefinitions: Record<ShapeType, ShapeDefinition> = {
    // Одиночный блок
    [ShapeType.SINGLE]: {
        type: ShapeType.SINGLE,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true]
            ]
        }
    },
    
    // Линия из 2 блоков
    [ShapeType.LINE_2]: {
        type: ShapeType.LINE_2,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, true]
            ],
            [ShapeOrientation.DEGREES_90]: [
                [true],
                [true]
            ]
        }
    },
    
    // Линия из 3 блоков
    [ShapeType.LINE_3]: {
        type: ShapeType.LINE_3,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, true, true]
            ],
            [ShapeOrientation.DEGREES_90]: [
                [true],
                [true],
                [true]
            ]
        }
    },
    
    // Г-образная фигура
    [ShapeType.L_SHAPE]: {
        type: ShapeType.L_SHAPE,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, false],
                [true, true]
            ],
            [ShapeOrientation.DEGREES_90]: [
                [true, true, true],
                [true, false, false]
            ],
            [ShapeOrientation.DEGREES_180]: [
                [true, true],
                [false, true]
            ],
            [ShapeOrientation.DEGREES_270]: [
                [false, false, true],
                [true, true, true]
            ]
        }
    },
    
    // Квадрат 2x2
    [ShapeType.SQUARE]: {
        type: ShapeType.SQUARE,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, true],
                [true, true]
            ]
        }
    },
    
    // T-образная фигура
    [ShapeType.T_SHAPE]: {
        type: ShapeType.T_SHAPE,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, true, true],
                [false, true, false]
            ],
            [ShapeOrientation.DEGREES_90]: [
                [false, true],
                [true, true],
                [false, true]
            ],
            [ShapeOrientation.DEGREES_180]: [
                [false, true, false],
                [true, true, true]
            ],
            [ShapeOrientation.DEGREES_270]: [
                [true, false],
                [true, true],
                [true, false]
            ]
        }
    },
    
    // Крест
    [ShapeType.CROSS]: {
        type: ShapeType.CROSS,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [false, true, false],
                [true, true, true],
                [false, true, false]
            ]
        }
    },
    
    // Z-образная фигура
    [ShapeType.Z_SHAPE]: {
        type: ShapeType.Z_SHAPE,
        matrices: {
            [ShapeOrientation.DEGREES_0]: [
                [true, true, false],
                [false, true, true]
            ],
            [ShapeOrientation.DEGREES_90]: [
                [false, true],
                [true, true],
                [true, false]
            ]
        }
    }
};

/**
 * Возвращает случайный элемент из массива
 */
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Выбирает случайный тип фигуры с учетом весов
 */
function getRandomShapeType(params?: ShapeGenerationParams): ShapeType {
    // Если задан forceTypes, выбираем случайный тип из него
    if (params?.forceTypes && params.forceTypes.length > 0) {
        return getRandomElement(params.forceTypes);
    }
    
    // Если задан excludeTypes, исключаем эти типы
    const availableTypes = Object.values(ShapeType).filter(type => 
        !params?.excludeTypes || !params.excludeTypes.includes(type)
    );
    
    if (availableTypes.length === 0) {
        return ShapeType.SINGLE; // Если все типы исключены, возвращаем одиночный блок
    }
    
    // Создаем массив весов для доступных типов
    const weights: number[] = [];
    const types: ShapeType[] = [];
    
    availableTypes.forEach(type => {
        weights.push(SHAPE_GENERATION_WEIGHTS[type]);
        types.push(type);
    });
    
    // Вычисляем сумму весов
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    // Генерируем случайное число от 0 до totalWeight
    let random = Math.random() * totalWeight;
    
    // Выбираем тип на основе весов
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return types[i];
        }
    }
    
    // Если что-то пошло не так, возвращаем последний тип
    return types[types.length - 1];
}

/**
 * Выбирает случайную ориентацию для указанного типа фигуры
 */
function getRandomOrientation(type: ShapeType): ShapeOrientation {
    const definition = shapeDefinitions[type];
    const orientations = Object.keys(definition.matrices).map(Number);
    return getRandomElement(orientations);
}

/**
 * Генерирует случайную фигуру
 */
export function generateRandomShape(params?: ShapeGenerationParams): Shape {
    const type = getRandomShapeType(params);
    // Всегда выбираем случайную ориентацию
    const orientation = getRandomOrientation(type);
    const definition = shapeDefinitions[type];
    
    // Выбираем случайный цвет из доступных
    const colors = params?.colorOptions || SHAPE_COLORS;
    const color = getRandomElement(colors);
    
    return {
        id: uuidv4(),
        type,
        orientation,
        color,
        matrix: definition.matrices[orientation] || [[true]]
    };
}

/**
 * Генерирует несколько случайных фигур
 */
export function generateRandomShapes(count: number, params?: ShapeGenerationParams): Shape[] {
    return Array(count).fill(null).map(() => generateRandomShape(params));
}

/**
 * Получает матрицу фигуры для указанного типа и ориентации
 */
export function getShapeMatrix(type: ShapeType, orientation: ShapeOrientation): boolean[][] {
    const definition = shapeDefinitions[type];
    return definition.matrices[orientation] || [[true]];
}

/**
 * Создает копию фигуры с измененной ориентацией
 */
export function rotateShape(shape: Shape): Shape {
    const definition = shapeDefinitions[shape.type];
    const orientations = Object.keys(definition.matrices).map(Number);
    
    if (orientations.length <= 1) {
        return { ...shape }; // Если нет других ориентаций, возвращаем копию фигуры
    }
    
    // Находим индекс текущей ориентации
    const currentIndex = orientations.indexOf(shape.orientation);
    
    // Вычисляем следующую ориентацию
    const nextIndex = (currentIndex + 1) % orientations.length;
    const nextOrientation = orientations[nextIndex];
    
    // Возвращаем новую фигуру с измененной ориентацией
    return {
        ...shape,
        orientation: nextOrientation,
        matrix: definition.matrices[nextOrientation as ShapeOrientation] || [[true]]
    };
}

/**
 * Получает все фигуры для туториала
 */
export function getTutorialShapes(): Record<string, Shape> {
    const result: Record<string, Shape> = {};
    
    // Создаем по одной фигуре каждого типа
    Object.values(ShapeType).forEach(type => {
        const orientation = Object.keys(shapeDefinitions[type].matrices)[0] as unknown as ShapeOrientation;
        result[type] = {
            id: `tutorial-${type}`,
            type,
            orientation,
            color: SHAPE_COLORS[Object.values(ShapeType).indexOf(type) % SHAPE_COLORS.length],
            matrix: shapeDefinitions[type].matrices[orientation] as boolean[][] || [[true]]
        };
    });
    
    return result;
}