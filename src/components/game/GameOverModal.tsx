/**
 * Модальное окно окончания игры
 */
import React, { FC, useEffect } from 'react';
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Title,
    ScoreContainer,
    ScoreRow,
    ScoreLabel,
    ScoreValue,
    HighScoreValue,
    ButtonsContainer,
    Button,
    NewHighScoreLabel,
} from './GameOverModal.styles';

interface Props {
    score: number;
    highScore: number;
    isNewHighScore: boolean;
    onRestart: () => void;
    onWatchAd?: () => void;
    onShare?: () => void;
    onMenu?: () => void;
}

export const GameOverModal: FC<Props> = ({
    score,
    highScore,
    isNewHighScore,
    onRestart,
    onWatchAd,
    onShare,
    onMenu,
}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <Title>Игра окончена</Title>
                    {isNewHighScore && <NewHighScoreLabel>Новый рекорд!</NewHighScoreLabel>}
                </ModalHeader>

                <ScoreContainer>
                    <ScoreRow>
                        <ScoreLabel>Ваш счет:</ScoreLabel>
                        <ScoreValue>{score.toLocaleString()}</ScoreValue>
                    </ScoreRow>

                    <ScoreRow>
                        <ScoreLabel>Рекорд:</ScoreLabel>
                        <HighScoreValue isNew={isNewHighScore}>
                            {highScore.toLocaleString()}
                        </HighScoreValue>
                    </ScoreRow>
                </ScoreContainer>

                <ButtonsContainer>
                    <Button primary onClick={onRestart}>
                        Играть снова
                    </Button>

                    {onWatchAd && (
                        <Button onClick={onWatchAd}>Смотреть рекламу для бонусных фигур</Button>
                    )}

                    {onShare && <Button onClick={onShare}>Поделиться результатом</Button>}

                    {onMenu && <Button onClick={onMenu}>Главное меню</Button>}
                </ButtonsContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default GameOverModal;
