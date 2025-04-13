/**
 * Компонент кнопки с различными стилями
 */
import React, { FC, ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

// Интерфейс свойств кнопки
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
}

// Компонент кнопки
export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    icon,
    loading = false,
    disabled = false,
    children,
    ...props
}) => {
    return (
        <StyledButton
            variant={variant}
            size={size}
            $fullWidth={fullWidth}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span>Загрузка...</span>
            ) : (
                <>
                    {icon && <span className="button-icon">{icon}</span>}
                    {children}
                </>
            )}
        </StyledButton>
    );
};

export default Button;