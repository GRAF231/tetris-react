import styled from 'styled-components';

export const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
    }
`;

export const GridContainer = styled.div`
    flex: 1;
    position: relative;
`;

export const SidePanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    @media (min-width: 768px) {
        width: 300px;
        gap: 20px;
    }
`;

export const MobileLayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 80px); // Учитываем уменьшенную шапку

    @media (min-width: 768px) {
        flex-direction: row;
        height: auto;
    }
`;

export const MobileScoreContainer = styled.div`
    margin-bottom: 12px;

    @media (min-width: 768px) {
        display: none;
    }
`;

export const MobilePreviewContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: auto; // Прижимаем к низу экрана

    @media (min-width: 768px) {
        display: none;
    }
`;

export const DesktopPreviewContainer = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`;

export const DesktopScoreContainer = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`;
