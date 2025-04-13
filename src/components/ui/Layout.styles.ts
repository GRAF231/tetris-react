import styled from 'styled-components';
import { PRIMARY, BACKGROUND, TEXT_PRIMARY, SHADOWS } from '../../constants/colors';

export const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${BACKGROUND};
`;

export const Header = styled.header<{ $compact?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => (props.$compact ? '8px 16px' : '16px 24px')};
    background-color: white;
    box-shadow: ${SHADOWS.SMALL};
    position: relative;
    z-index: 10;
    height: ${(props) => (props.$compact ? '50px' : 'auto')};
`;

export const Logo = styled.div<{ $compact?: boolean }>`
    font-size: ${(props) => (props.$compact ? '18px' : '24px')};
    font-weight: 700;
    color: ${PRIMARY};
    display: flex;
    align-items: center;
    gap: 8px;

    svg,
    img {
        height: ${(props) => (props.$compact ? '24px' : '32px')};
        width: auto;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

export const MainContent = styled.main<{ $compact?: boolean }>`
    flex: 1;
    padding: ${(props) => (props.$compact ? '12px' : '24px')};
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: ${(props) => (props.$compact ? '8px' : '16px')};
    }
`;

export const Footer = styled.footer`
    padding: 16px 24px;
    background-color: white;
    color: ${TEXT_PRIMARY};
    font-size: 14px;
    text-align: center;
    border-top: 1px solid #eee;
`;
