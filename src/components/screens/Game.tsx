/**
 * Игровой экран приложения
 */
import React, { FC, useState } from 'react';
import Layout from '../ui/Layout';
import Button from '../ui/Button';
import GameController from '../game/GameController';
import Modal from '../ui/Modal';
import { useScore } from '../../hooks/useScore';
import {
    GameContainer,
    HeaderActions,
    PauseModal,
    PauseTitle,
    PauseButtons
} from './Game.styles';

interface Props {
    onBackToMenu: () => void;
    onShareScore?: (score: number) => void;
}

export const Game: FC<Props> = ({ onBackToMenu, onShareScore }) => {
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const { score } = useScore();
    
    const handleExit = () => {
        setShowExitConfirmation(true);
    };
    
    const confirmExit = () => {
        setShowExitConfirmation(false);
        onBackToMenu();
    };
    
    const cancelExit = () => {
        setShowExitConfirmation(false);
    };
    
    const handleShareScore = () => {
        if (onShareScore) {
            onShareScore(score);
        }
    };
    
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