import styled, { css } from 'styled-components';
import { PRIMARY, GRADIENTS, SHADOWS } from '../../constants/colors';
import { ButtonVariant, ButtonSize } from './Button';

// Базовые стили для всех кнопок
export const baseButtonStyles = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    border-radius: 8px;
    font-family: inherit;
    position: relative;
    overflow: hidden;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }

    &:active {
        transform: translateY(1px);
    }
`;

// Стили для размеров кнопок
export const buttonSizeStyles = {
    small: css`
        padding: 8px 16px;
        font-size: 14px;
        height: 36px;
    `,
    medium: css`
        padding: 10px 20px;
        font-size: 16px;
        height: 44px;
    `,
    large: css`
        padding: 12px 24px;
        font-size: 18px;
        height: 52px;
    `,
};

// Стили для вариантов кнопок
export const buttonVariantStyles = {
    primary: css`
        background: ${GRADIENTS.PRIMARY};
        color: white;
        box-shadow: ${SHADOWS.MEDIUM};

        &:hover {
            box-shadow: ${SHADOWS.LARGE};
            transform: translateY(-2px);
        }

        &:active {
            box-shadow: ${SHADOWS.SMALL};
            transform: translateY(0);
        }
    `,
    secondary: css`
        background: ${GRADIENTS.SECONDARY};
        color: white;
        box-shadow: ${SHADOWS.MEDIUM};

        &:hover {
            box-shadow: ${SHADOWS.LARGE};
            transform: translateY(-2px);
        }

        &:active {
            box-shadow: ${SHADOWS.SMALL};
            transform: translateY(0);
        }
    `,
    outline: css`
        background: transparent;
        color: ${PRIMARY};
        border: 2px solid ${PRIMARY};

        &:hover {
            background: rgba(63, 81, 181, 0.05);
        }

        &:active {
            background: rgba(63, 81, 181, 0.1);
        }
    `,
    text: css`
        background: transparent;
        color: ${PRIMARY};
        padding-left: 8px;
        padding-right: 8px;

        &:hover {
            background: rgba(63, 81, 181, 0.05);
        }

        &:active {
            background: rgba(63, 81, 181, 0.1);
        }
    `,
};

// Стилизованная кнопка
export const StyledButton = styled.button<{
    variant: ButtonVariant;
    size: ButtonSize;
    $fullWidth?: boolean;
}>`
    ${baseButtonStyles}
    ${(props) => buttonSizeStyles[props.size]}
    ${(props) => buttonVariantStyles[props.variant]}
    
    width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};

    /* Стиль для иконки внутри кнопки */
    .button-icon {
        margin-right: ${(props) => (props.children ? '8px' : '0')};
    }

    /* Эффект пульсации при клике */
    &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%, -50%);
        transform-origin: 50% 50%;
    }

    &:focus:not(:active)::after {
        animation: ripple 0.6s ease-out;
    }

    @keyframes ripple {
        0% {
            transform: scale(0, 0) translate(-50%, -50%);
            opacity: 0.5;
        }
        100% {
            transform: scale(20, 20) translate(-50%, -50%);
            opacity: 0;
        }
    }
`;
