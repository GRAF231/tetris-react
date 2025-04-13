import styled from 'styled-components';
import { PRIMARY, GRADIENTS, SHADOWS } from '../../constants/colors';

export const MainContainer = styled.div`
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

export const GameTitle = styled.h1`
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

export const GameSubtitle = styled.h2`
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

export const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 320px;
`;

export const LanguageSwitcher = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 32px;
    gap: 8px;
`;

export const LanguageButton = styled.button<{ active: boolean }>`
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

export const GamePreview = styled.div`
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