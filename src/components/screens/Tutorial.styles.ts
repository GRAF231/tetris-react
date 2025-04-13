import styled from 'styled-components';
import { PRIMARY, SECONDARY, SHADOWS, GRID_BACKGROUND } from '../../constants/colors';

export const TutorialContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

export const StepContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: ${SHADOWS.MEDIUM};
    padding: 24px;
    margin-bottom: 24px;
`;

export const StepTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 16px;
    color: ${PRIMARY};
`;

export const StepContent = styled.div`
    margin-bottom: 20px;
    line-height: 1.6;
    font-size: 16px;
`;

export const DemoArea = styled.div`
    background-color: ${GRID_BACKGROUND};
    border-radius: 8px;
    padding: 24px;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

export const ShapesContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 16px 0;
`;

export const ShapeWrapper = styled.div`
    padding: 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: ${SHADOWS.SMALL};
`;

export const GridWrapper = styled.div`
    width: 100%;
    max-width: 400px;
`;

export const NavigationButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
`;

export const StepIndicator = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 24px 0;
`;

export const StepDot = styled.div<{ active: boolean; completed: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => (props.active ? PRIMARY : props.completed ? SECONDARY : '#ddd')};
    transition: all 0.3s ease;
`;
