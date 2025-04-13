/**
 * Главный экран приложения
 */
import React, { FC } from 'react';
import Layout from '../ui/Layout';
import Button from '../ui/Button';
import {
    MainContainer,
    GameTitle,
    GameSubtitle,
    ButtonsContainer,
    LanguageSwitcher,
    LanguageButton,
    GamePreview,
} from './Main.styles';

const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
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
    currentLanguage = 'ru',
}) => {
    return (
        <Layout>
            <MainContainer>
                <GameTitle>Тетрис-блоки</GameTitle>
                <GameSubtitle>
                    Увлекательная головоломка, где нужно размещать фигуры на игровой сетке и очищать
                    линии
                </GameSubtitle>

                <GamePreview>
                    {/* Здесь будет добавлено изображение или анимация игры */}
                </GamePreview>

                <ButtonsContainer>
                    <Button variant="primary" size="large" fullWidth onClick={onStartGame}>
                        Играть
                    </Button>

                    <Button variant="outline" size="medium" fullWidth onClick={onOpenTutorial}>
                        Обучение
                    </Button>

                    <Button variant="outline" size="medium" fullWidth onClick={onOpenSettings}>
                        Настройки
                    </Button>

                    <Button variant="outline" size="medium" fullWidth onClick={onOpenAchievements}>
                        Достижения
                    </Button>
                </ButtonsContainer>

                <LanguageSwitcher>
                    {languages.map((language) => (
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
