/**
 * Основной макет приложения
 */
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { PRIMARY, BACKGROUND, TEXT_PRIMARY, SHADOWS } from '../../constants/colors';

// Стилизованные компоненты
const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${BACKGROUND};
`;

const Header = styled.header<{ $compact?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.$compact ? '8px 16px' : '16px 24px'};
    background-color: white;
    box-shadow: ${SHADOWS.SMALL};
    position: relative;
    z-index: 10;
    height: ${props => props.$compact ? '50px' : 'auto'};
`;

const Logo = styled.div<{ $compact?: boolean }>`
    font-size: ${props => props.$compact ? '18px' : '24px'};
    font-weight: 700;
    color: ${PRIMARY};
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg, img {
        height: ${props => props.$compact ? '24px' : '32px'};
        width: auto;
    }
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;
const MainContent = styled.main<{ $compact?: boolean }>`
    flex: 1;
    padding: ${props => props.$compact ? '12px' : '24px'};
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    
    @media (max-width: 768px) {
        padding: ${props => props.$compact ? '8px' : '16px'};
    }
`;

const Footer = styled.footer`
    padding: 16px 24px;
    background-color: white;
    color: ${TEXT_PRIMARY};
    font-size: 14px;
    text-align: center;
    border-top: 1px solid #eee;
`;

interface Props {
    children: ReactNode;
    headerContent?: ReactNode;
    headerActions?: ReactNode;
    footerContent?: ReactNode;
    showFooter?: boolean;
    showHeader?: boolean;
    className?: string;
    compact?: boolean; // Новое свойство для компактного режима
}

export const Layout: FC<Props> = ({
    children,
    headerContent,
    headerActions,
    footerContent,
    showFooter = true,
    showHeader = true,
    className,
    compact = false
}) => {
    return (
        <LayoutContainer className={className}>
            {showHeader && (
                <Header $compact={compact}>
                    <Logo $compact={compact}>
                        {headerContent || (
                            <>
                                <span>Тетрис-блоки</span>
                            </>
                        )}
                    </Logo>
                    
                    {headerActions && <HeaderActions>{headerActions}</HeaderActions>}
                </Header>
            )}
            <MainContent $compact={compact}>{children}</MainContent>
            
            {showFooter && (
                <Footer>
                    {footerContent || (
                        <div>
                            &copy; {new Date().getFullYear()} Тетрис-блоки. Все права защищены.
                        </div>
                    )}
                </Footer>
            )}
        </LayoutContainer>
    );
};

// Экспорт по умолчанию (чтобы с ним работали существующие импорты)
export default Layout;