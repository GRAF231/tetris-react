/**
 * Компонент для отображения счета и комбо
 */
import React, { FC, useRef, useEffect } from 'react';
import {
    ScoreContainer,
    ScoreRow,
    ScoreLabel,
    ScoreValue,
    HighScoreValue,
    ComboContainer,
    ComboLabel,
    ComboValue,
    ComboText,
    PointsPopup
} from './Score.styles';

interface Props {
    currentScore: number;
    highScore: number;
    combo: number;
    comboMultiplier: number;
    comboText: string;
    isNewHighScore?: boolean;
    scoreAnimation?: {
        points: number;
        x: number;
        y: number;
        visible: boolean;
    } | null;
    horizontal?: boolean; // Новый параметр для горизонтального отображения
}

export const Score: FC<Props> = ({
    currentScore,
    highScore,
    combo,
    comboMultiplier,
    comboText,
    isNewHighScore = false,
    scoreAnimation,
    horizontal = false
}) => {
    const prevScoreRef = useRef(currentScore);
    const scoreRef = useRef<HTMLDivElement>(null);
    const [highlight, setHighlight] = React.useState(false);
    
    useEffect(() => {
        if (currentScore > prevScoreRef.current) {
            setHighlight(true);
            const timer = setTimeout(() => setHighlight(false), 500);
            return () => clearTimeout(timer);
        }
        prevScoreRef.current = currentScore;
    }, [currentScore]);
    
    return (
        <ScoreContainer $horizontal={horizontal}>
            <ScoreRow $horizontal={horizontal}>
                <ScoreLabel $horizontal={horizontal}>Счет</ScoreLabel>
                <ScoreValue ref={scoreRef} $highlight={highlight} $horizontal={horizontal}>
                    {currentScore.toLocaleString()}
                </ScoreValue>
                {horizontal && combo > 0 && (
                    <ComboText active={combo > 0} $horizontal={horizontal}>
                        {comboText}
                    </ComboText>
                )}
            </ScoreRow>
            
            <ScoreRow $horizontal={horizontal}>
                <ScoreLabel $horizontal={horizontal}>Рекорд</ScoreLabel>
                <HighScoreValue $horizontal={horizontal}>
                    {highScore.toLocaleString()}
                    {isNewHighScore && ' 🏆'}
                </HighScoreValue>
            </ScoreRow>
            
            <ComboContainer $horizontal={horizontal}>
                <ComboLabel $horizontal={horizontal}>Комбо</ComboLabel>
                <ComboValue active={combo > 0} $horizontal={horizontal}>
                    {combo > 0 ? `×${comboMultiplier.toFixed(1)}` : '-'}
                </ComboValue>
            </ComboContainer>
            
            {!horizontal && (
                <ComboText active={combo > 0} $horizontal={horizontal}>
                    {comboText}
                </ComboText>
            )}
            
            {scoreAnimation && (
                <PointsPopup
                    show={scoreAnimation.visible}
                    x={scoreAnimation.x}
                    y={scoreAnimation.y}
                >
                    +{scoreAnimation.points}
                </PointsPopup>
            )}
        </ScoreContainer>
    );
};

export default Score;