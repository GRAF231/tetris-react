import styled from 'styled-components';
import { MODAL_BACKGROUND, TEXT_PRIMARY, SHADOWS } from '../../constants/colors';
import { ModalSize } from './Modal';

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

export const ModalOverlay = styled.div`
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

export const ModalContainer = styled.div<{ size: ModalSize }>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 12px;
    box-shadow: ${SHADOWS.LARGE};
    width: ${(props) => {
        switch (props.size) {
            case 'small':
                return '90%';
            case 'medium':
                return '90%';
            case 'large':
                return '95%';
            default:
                return '90%';
        }
    }};
    max-width: ${(props) => {
        switch (props.size) {
            case 'small':
                return '400px';
            case 'medium':
                return '600px';
            case 'large':
                return '800px';
            default:
                return '600px';
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

export const ModalHeader = styled.div<{ hasClose: boolean }>`
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.hasClose ? 'space-between' : 'center')};
    position: relative;
`;

export const ModalTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin: 0;
`;

export const CloseButton = styled.button`
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

export const ModalContent = styled.div`
    padding: 24px;
    overflow-y: auto;
    flex: 1;
`;

export const ModalFooter = styled.div`
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;
