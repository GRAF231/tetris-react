/**
 * Универсальный компонент модального окна
 */
import React, { FC, ReactNode, useEffect } from 'react';
import Button from './Button';
import {
    ModalOverlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    CloseButton,
    ModalContent,
    ModalFooter
} from './Modal.styles';

export type ModalSize = 'small' | 'medium' | 'large';
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
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };
    
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