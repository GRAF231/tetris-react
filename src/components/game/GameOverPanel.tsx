import React, { FC } from 'react';
import GameOverModal from './GameOverModal';

interface GameOverPanelProps {
    isGameOver: boolean;
    score: number;
    highScore: number;
    isNewHighScore: boolean;
    onRestart: () => void;
    onWatchAd: () => void;
    onShare?: () => void;
    onMainMenu?: () => void;
}

/**
 * Компонент для отображения модального окна завершения игры
 */
export const GameOverPanel: FC<GameOverPanelProps> = ({
    isGameOver,
    score,
    highScore,
    isNewHighScore,
    onRestart,
    onWatchAd,
    onShare,
    onMainMenu,
}) => {
    if (!isGameOver) return null;

    return (
        <GameOverModal
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onRestart={onRestart}
            onWatchAd={onWatchAd}
            onShare={onShare}
            onMenu={onMainMenu}
        />
    );
};

export default GameOverPanel;
