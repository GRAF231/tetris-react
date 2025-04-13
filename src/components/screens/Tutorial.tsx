/**
 * Экран обучения (туториал)
 */
import React, { FC, useState } from 'react';
import Layout from '../ui/Layout';
import Button from '../ui/Button';
import { ShapeType as ShapeTypeEnum } from '../../types/game';
import Shape from '../game/Shape';
import Grid from '../game/Grid';
import { createEmptyGrid } from '../../core/gameLogic';
import { getTutorialShapes } from '../../core/shapeGenerator';
import {
    TutorialContainer,
    StepContainer,
    StepTitle,
    StepContent,
    DemoArea,
    ShapesContainer,
    ShapeWrapper,
    GridWrapper,
    NavigationButtons,
    StepIndicator,
    StepDot,
} from './Tutorial.styles';

// Данные шагов туториала
const tutorialSteps = [
    {
        title: 'Добро пожаловать в Тетрис-блоки!',
        content:
            'Добро пожаловать в игру "Тетрис-блоки"! Эта игра сочетает в себе элементы классического Тетриса и головоломки. Ваша задача - размещать различные фигуры на сетке 8x8, чтобы заполнять строки и столбцы, зарабатывая очки. Давайте разберемся с основными правилами игры!',
        showShapes: true,
        showGrid: false,
    },
    {
        title: 'Игровая сетка',
        content:
            'Игра происходит на сетке 8x8 клеток. Вам нужно размещать фигуры на этой сетке так, чтобы заполнять целые строки или столбцы. Заполненные строки и столбцы исчезают, а вы получаете очки.',
        showShapes: false,
        showGrid: true,
    },
    {
        title: 'Фигуры',
        content:
            'В игре есть 8 типов фигур разных форм и цветов. Вы всегда имеете на выбор 3 фигуры. После размещения фигуры на сетке, она заменяется новой. Вы можете вращать фигуру, нажав на кнопку в её правом верхнем углу.',
        showShapes: true,
        showGrid: false,
    },
    {
        title: 'Размещение фигур',
        content:
            'Чтобы разместить фигуру, выберите её и перетащите на игровую сетку. Во время перетаскивания, фигура отображается в виде "призрака". Зеленый цвет "призрака" означает, что фигуру можно разместить в этой позиции, красный - что нельзя.',
        showShapes: true,
        showGrid: true,
    },
    {
        title: 'Очистка линий',
        content:
            'Когда вы полностью заполняете строку или столбец, они очищаются, и вы получаете очки. За каждую очищенную ячейку вы получаете 10 базовых очков. Если вы очищаете несколько линий одновременно (и строки, и столбцы), применяется множитель 1.5.',
        showShapes: false,
        showGrid: true,
    },
    {
        title: 'Комбо и стратегия',
        content:
            'Если вы очищаете линии несколько ходов подряд, вы получаете комбо-бонус, который увеличивает количество получаемых очков. Старайтесь планировать свои ходы так, чтобы заполнять линии последовательно и получать больше очков!',
        showShapes: false,
        showGrid: true,
    },
    {
        title: 'Окончание игры',
        content:
            'Игра заканчивается, когда на поле больше невозможно разместить ни одну из доступных фигур. После окончания игры вы можете посмотреть рекламу, чтобы получить бонусные фигуры и продолжить игру, или начать новую игру.',
        showShapes: true,
        showGrid: true,
    },
];

interface Props {
    onFinish: () => void;
    onSkip: () => void;
}

export const Tutorial: FC<Props> = ({ onFinish, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const demoShapes = getTutorialShapes();
    const grid = createEmptyGrid();

    const goToNextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentStepData = tutorialSteps[currentStep];
    const dummyFunction = () => {};

    return (
        <Layout
            headerActions={
                <Button variant="outline" size="small" onClick={onSkip}>
                    Пропустить
                </Button>
            }
        >
            <TutorialContainer>
                <StepContainer>
                    <StepTitle>{currentStepData.title}</StepTitle>
                    <StepContent>{currentStepData.content}</StepContent>

                    <DemoArea>
                        {currentStepData.showShapes && (
                            <ShapesContainer>
                                {Object.values(ShapeTypeEnum)
                                    .slice(0, 4)
                                    .map((type) => (
                                        <ShapeWrapper key={type}>
                                            <Shape shape={demoShapes[type]} draggable={false} />
                                        </ShapeWrapper>
                                    ))}
                            </ShapesContainer>
                        )}

                        {currentStepData.showGrid && (
                            <GridWrapper>
                                <Grid
                                    grid={grid}
                                    selectedShape={null}
                                    ghostPosition={null}
                                    highlightedLines={[]}
                                    onCellClick={dummyFunction}
                                />
                            </GridWrapper>
                        )}
                    </DemoArea>

                    <StepIndicator>
                        {tutorialSteps.map((_, index) => (
                            <StepDot
                                key={index}
                                active={index === currentStep}
                                completed={index < currentStep}
                            />
                        ))}
                    </StepIndicator>

                    <NavigationButtons>
                        <Button
                            variant="outline"
                            onClick={goToPreviousStep}
                            disabled={currentStep === 0}
                        >
                            Назад
                        </Button>

                        <Button variant="primary" onClick={goToNextStep}>
                            {currentStep === tutorialSteps.length - 1 ? 'Завершить' : 'Далее'}
                        </Button>
                    </NavigationButtons>
                </StepContainer>
            </TutorialContainer>
        </Layout>
    );
};

export default Tutorial;
