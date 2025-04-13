/**
 * Главный экран приложения
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Layout from '../ui/Layout';
import Button from '../ui/Button';
import { PRIMARY, GRADIENTS, SHADOWS } from '../../constants/colors';

// Стилизованные компоненты
const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    
    @media (min-width: 768px) {
        padding: 60px 20px;
    }
`;

const GameTitle = styled.h1`
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 8px;
    text-align: center;
    background: ${GRADIENTS.PRIMARY};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (min-width: 768px) {
        font-size: 48px;
    }
`;

const GameSubtitle = styled.h2`
    font-size: 18px;
    font-weight: 400;
    color: #666;
    margin-bottom: 40px;
    text-align: center;
    max-width: 600px;
    
    @media (min-width: 768px) {
        font-size: 22px;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 320px;
`;

const LanguageSwitcher = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 32px;
    gap: 8px;
`;

const LanguageButton = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    border: 2px solid ${props => props.active ? PRIMARY : '#ddd'};
    background-color: ${props => props.active ? 'rgba(63, 81, 181, 0.1)' : 'transparent'};
    color: ${props => props.active ? PRIMARY : '#666'};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${props => props.active ? 'rgba(63, 81, 181, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    }
`;

const GamePreview = styled.div`
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    background-color: white;
    margin-bottom: 40px;
    box-shadow: ${SHADOWS.MEDIUM};
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

// Список языков
const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' }
];

interface Props {
    onStartGame: () => void;
    onOpenTutorial: () => void;
    onOpenSettings: () => void;
    onOpenAchievements: () => void;
    onLanguageChange: (languageCode: string) => void;
    currentLanguage: string;
}

export const Main: FC<Props> = ({
    onStartGame,
    onOpenTutorial,
    onOpenSettings,
    onOpenAchievements,
    onLanguageChange,
    currentLanguage = 'ru'
}) => {
    return (
        <Layout>
            <MainContainer>
                <GameTitle>Тетрис-блоки</GameTitle>
                <GameSubtitle>
                    Увлекательная головоломка, где нужно размещать фигуры на игровой сетке и очищать линии
                </GameSubtitle>
                
                <GamePreview>
                    {/* Здесь будет добавлено изображение или анимация игры */}
                </GamePreview>
                
                <ButtonsContainer>
                    <Button 
                        variant="primary" 
                        size="large" 
                        fullWidth 
                        onClick={onStartGame}
                    >
                        Играть
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="medium" 
                        fullWidth 
                        onClick={onOpenTutorial}
                    >
                        Обучение
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="medium" 
                        fullWidth 
                        onClick={onOpenSettings}
                    >
                        Настройки
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="medium" 
                        fullWidth 
                        onClick={onOpenAchievements}
                    >
                        Достижения
                    </Button>
                </ButtonsContainer>
                
                <LanguageSwitcher>
                    {languages.map(language => (
                        <LanguageButton
                            key={language.code}
                            active={currentLanguage === language.code}
                            onClick={() => onLanguageChange(language.code)}
                        >
                            {language.name}
                        </LanguageButton>
                    ))}
                </LanguageSwitcher>
            </MainContainer>
        </Layout>
    );
};

export default Main;