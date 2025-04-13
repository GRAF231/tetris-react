/**
 * Игровой экран приложения
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Layout from '../ui/Layout';
import Button from '../ui/Button';
import GameController from '../game/GameController';
import Modal from '../ui/Modal';
import { useScore } from '../../hooks/useScore';

// Стилизованные компоненты
const GameContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 12px;
`;

const PauseModal = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 20px;
`;

const PauseTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 8px;
`;

const PauseButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
`;

interface Props {
    onBackToMenu: () => void;
    onShareScore?: (score: number) => void;
}

export const Game: FC<Props> = ({ onBackToMenu, onShareScore }) => {
    // Состояние для подтверждения выхода
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    
    // Используем хук счета для доступа к текущему счету
    const { score } = useScore();
    
    // Обработчик выхода в меню
    const handleExit = () => {
        setShowExitConfirmation(true);
    };
    
    // Обработчик подтверждения выхода
    const confirmExit = () => {
        setShowExitConfirmation(false);
        onBackToMenu();
    };
    
    // Обработчик отмены выхода
    const cancelExit = () => {
        setShowExitConfirmation(false);
    };
    
    // Обработчик для шаринга счета
    const handleShareScore = () => {
        if (onShareScore) {
            onShareScore(score);
        }
    };
    
    // Компоненты для хедера
    const headerActions = (
        <HeaderActions>
            <Button variant="outline" size="small" onClick={handleExit}>
                Выйти
            </Button>
        </HeaderActions>
    );
    
    return (
        <Layout headerActions={headerActions} compact={true} showFooter={false}>
            <GameContainer>
                <GameController
                    onShare={onShareScore ? handleShareScore : undefined}
                    onMainMenu={onBackToMenu}
                />
                
                
                {/* Модальное окно подтверждения выхода */}
                <Modal
                    isOpen={showExitConfirmation}
                    onClose={cancelExit}
                    title="Подтверждение выхода"
                    size="small"
                >
                    <PauseModal>
                        <p>Вы уверены, что хотите выйти? Текущий прогресс будет потерян.</p>
                        
                        <PauseButtons>
                            <Button 
                                variant="secondary" 
                                size="medium" 
                                fullWidth 
                                onClick={confirmExit}
                            >
                                Выйти
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                size="medium" 
                                fullWidth 
                                onClick={cancelExit}
                            >
                                Отмена
                            </Button>
                        </PauseButtons>
                    </PauseModal>
                </Modal>
            </GameContainer>
        </Layout>
    );
};

export default Game;