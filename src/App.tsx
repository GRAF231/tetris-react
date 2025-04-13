/**
 * Основной компонент приложения
 */
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import Main from './components/screens/Main';
import Game from './components/screens/Game';
import Tutorial from './components/screens/Tutorial';
import { BACKGROUND } from './constants/colors';

// Глобальные стили
const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: 'Roboto', 'Arial', sans-serif;
        background-color: ${BACKGROUND};
        color: #333;
        line-height: 1.5;
    }
    
    button {
        font-family: 'Roboto', 'Arial', sans-serif;
    }
`;

// Типы экранов
type Screen = 'main' | 'game' | 'tutorial' | 'settings' | 'achievements';

function App() {
    // Текущий активный экран
    const [currentScreen, setCurrentScreen] = useState<Screen>('main');

    // Текущий язык
    const [currentLanguage, setCurrentLanguage] = useState('ru');

    // Оповещения и сообщения
    const [notification, setNotification] = useState<string | null>(null);

    // Эффект для загрузки сохраненного языка
    useEffect(() => {
        try {
            const savedLanguage = localStorage.getItem('tetrisBlocksLanguage');
            if (savedLanguage) {
                setCurrentLanguage(savedLanguage);
            }
        } catch (e) {
            console.error('Failed to load language preference:', e);
        }
    }, []);

    // Обработчик изменения языка
    const handleLanguageChange = (languageCode: string) => {
        setCurrentLanguage(languageCode);
        try {
            localStorage.setItem('tetrisBlocksLanguage', languageCode);
        } catch (e) {
            console.error('Failed to save language preference:', e);
        }
    };

    // Обработчик для начала игры
    const handleStartGame = () => {
        setCurrentScreen('game');
    };

    // Обработчик для открытия туториала
    const handleOpenTutorial = () => {
        setCurrentScreen('tutorial');
    };

    // Заглушки для остальных экранов
    const handleOpenSettings = () => {
        setNotification('Настройки будут доступны в следующей версии');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenAchievements = () => {
        setNotification('Достижения будут доступны в следующей версии');
        setTimeout(() => setNotification(null), 3000);
    };

    // Обработчик для возврата на главный экран
    const handleBackToMenu = () => {
        setCurrentScreen('main');
    };

    // Обработчик для завершения туториала
    const handleFinishTutorial = () => {
        setCurrentScreen('main');
    };

    // Обработчик для шаринга счета
    const handleShareScore = (score: number) => {
        // Заглушка для функции шаринга
        console.log(`Поделиться счетом: ${score}`);
        setNotification(`Делимся счетом: ${score} очков`);
        setTimeout(() => setNotification(null), 3000);
    };

    // Рендеринг активного экрана
    const renderActiveScreen = () => {
        switch (currentScreen) {
            case 'main':
                return (
                    <Main
                        onStartGame={handleStartGame}
                        onOpenTutorial={handleOpenTutorial}
                        onOpenSettings={handleOpenSettings}
                        onOpenAchievements={handleOpenAchievements}
                        onLanguageChange={handleLanguageChange}
                        currentLanguage={currentLanguage}
                    />
                );
            case 'game':
                return <Game onBackToMenu={handleBackToMenu} onShareScore={handleShareScore} />;
            case 'tutorial':
                return <Tutorial onFinish={handleFinishTutorial} onSkip={handleBackToMenu} />;
            default:
                return (
                    <Main
                        onStartGame={handleStartGame}
                        onOpenTutorial={handleOpenTutorial}
                        onOpenSettings={handleOpenSettings}
                        onOpenAchievements={handleOpenAchievements}
                        onLanguageChange={handleLanguageChange}
                        currentLanguage={currentLanguage}
                    />
                );
        }
    };

    // Стили для уведомлений
    const notificationStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'opacity 0.3s ease',
        opacity: notification ? 1 : 0,
        pointerEvents: 'none',
    };

    return (
        <>
            <GlobalStyle />
            {renderActiveScreen()}

            {/* Уведомления */}
            {notification && <div style={notificationStyle}>{notification}</div>}
        </>
    );
}

export default App;
