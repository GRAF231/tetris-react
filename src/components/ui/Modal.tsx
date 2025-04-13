/**
 * Универсальный компонент модального окна
 */
import React, { FC, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { MODAL_BACKGROUND, TEXT_PRIMARY, SHADOWS } from '../../constants/colors';
import Button from './Button';

// Анимации для модального окна
const fadeIn = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const slideIn = `
    @keyframes slideIn {
        from {
            transform: translate(-50%, -40%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%);
            opacity: 1;
        }
    }
`;

// Стилизованные компоненты
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${MODAL_BACKGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
    ${fadeIn}
`;

const ModalContainer = styled.div<{ size: ModalSize }>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 12px;
    box-shadow: ${SHADOWS.LARGE};
    width: ${props => {
        switch (props.size) {
            case 'small': return '90%';
            case 'medium': return '90%';
            case 'large': return '95%';
            default: return '90%';
        }
    }};
    max-width: ${props => {
        switch (props.size) {
            case 'small': return '400px';
            case 'medium': return '600px';
            case 'large': return '800px';
            default: return '600px';
        }
    }};
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
    ${slideIn}
    
    @media (max-width: 600px) {
        width: 95%;
    }
`;

const ModalHeader = styled.div<{ hasClose: boolean }>`
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: ${props => props.hasClose ? 'space-between' : 'center'};
    position: relative;
`;

const ModalTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    padding: 0;
    cursor: pointer;
    color: #999;
    transition: color 0.2s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    
    &:hover {
        color: ${TEXT_PRIMARY};
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    &:active {
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    &::before {
        content: '×';
    }
`;

const ModalContent = styled.div`
    padding: 24px;
    overflow-y: auto;
    flex: 1;
`;

const ModalFooter = styled.div`
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

// Типы модальных окон
export type ModalSize = 'small' | 'medium' | 'large';

// Интерфейс свойств модального окна
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: ModalSize;
    hideCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    footer?: ReactNode;
    children: ReactNode;
}

// Компонент модального окна
export const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    size = 'medium',
    hideCloseButton = false,
    closeOnOverlayClick = true,
    footer,
    children
}) => {
    // Предотвращаем прокрутку страницы при открытом модальном окне
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    
    // Обработчик клика по оверлею
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };
    
    // Обработчик нажатия клавиши Escape
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);
    
    // Если модальное окно закрыто, не рендерим ничего
    if (!isOpen) return null;
    
    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer size={size} onClick={e => e.stopPropagation()}>
                {title && (
                    <ModalHeader hasClose={!hideCloseButton}>
                        <ModalTitle>{title}</ModalTitle>
                        {!hideCloseButton && <CloseButton onClick={onClose} />}
                    </ModalHeader>
                )}
                
                <ModalContent>{children}</ModalContent>
                
                {footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContainer>
        </ModalOverlay>
    );
};

// Пример использования с кнопками в футере
export const ModalWithButtons: FC<
    ModalProps & {
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        danger?: boolean;
    }
> = ({
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    onConfirm,
    danger = false,
    ...modalProps
}) => {
    const footer = (
        <>
            <Button variant="outline" onClick={modalProps.onClose}>
                {cancelText}
            </Button>
            <Button 
                variant={danger ? 'secondary' : 'primary'} 
                onClick={() => {
                    if (onConfirm) onConfirm();
                    modalProps.onClose();
                }}
            >
                {confirmText}
            </Button>
        </>
    );
    
    return <Modal {...modalProps} footer={footer} />;
};

export default Modal;