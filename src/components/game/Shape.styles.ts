import styled from 'styled-components';

export const ShapeContainer = styled.div<{
    $draggable: boolean;
    $isDragging: boolean;
    $width: number;
    $height: number;
    $translateX?: number;
    $translateY?: number;
    $returningToOrigin?: boolean;
}>`
    display: grid;
    gap: 2px;
    background-color: transparent;
    width: ${(props) => props.$width * 30}px;
    height: ${(props) => props.$height * 30}px;
    position: relative;
    ${(props) =>
        (props.$isDragging || props.$returningToOrigin) &&
        `
        transform: translate(${props.$translateX}px, ${props.$translateY}px);
        z-index: 1000;
        pointer-events: none;
    `}
    cursor: ${(props) => (props.$draggable ? 'grab' : 'default')};
    touch-action: none;
    user-select: none;
    transition: ${(props) =>
        props.$returningToOrigin
            ? 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            : 'transform 0.1s ease, box-shadow 0.1s ease'};

    &:hover {
        transform: ${(props) =>
            !props.$isDragging && !props.$returningToOrigin && props.$draggable
                ? 'scale(1.05)'
                : props.$isDragging || props.$returningToOrigin
                  ? `translate(${props.$translateX}px, ${props.$translateY}px)`
                  : 'none'};
        box-shadow: ${(props) =>
            !props.$isDragging && !props.$returningToOrigin && props.$draggable
                ? '0 5px 15px rgba(0, 0, 0, 0.1)'
                : 'none'};
    }

    &:active {
        cursor: ${(props) => (props.$draggable ? 'grabbing' : 'default')};
    }
`;

export const ShapeGrid = styled.div<{ columns: number; rows: number }>`
    display: grid;
    grid-template-columns: repeat(${(props) => props.columns}, 1fr);
    grid-template-rows: repeat(${(props) => props.rows}, 1fr);
    gap: 2px;
    width: 100%;
    height: 100%;
`;

export const ShapeCell = styled.div<{ filled: boolean; color: string }>`
    background-color: ${(props) => (props.filled ? props.color : 'transparent')};
    border-radius: 4px;
    aspect-ratio: 1/1;
    box-shadow: ${(props) =>
        props.filled
            ? 'inset 0 2px 2px rgba(255, 255, 255, 0.5), inset 0 -2px 2px rgba(0, 0, 0, 0.2)'
            : 'none'};
    border: ${(props) => (props.filled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none')};
`;
