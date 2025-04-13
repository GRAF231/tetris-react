/**
 * Основной макет приложения
 */
import React, { FC, ReactNode } from 'react';
import { LayoutContainer, Header, Logo, HeaderActions, MainContent, Footer } from './Layout.styles';

interface Props {
    children: ReactNode;
    headerContent?: ReactNode;
    headerActions?: ReactNode;
    footerContent?: ReactNode;
    showFooter?: boolean;
    showHeader?: boolean;
    className?: string;
    compact?: boolean;
}

export const Layout: FC<Props> = ({
    children,
    headerContent,
    headerActions,
    footerContent,
    showFooter = true,
    showHeader = true,
    className,
    compact = false,
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
export default Layout;
