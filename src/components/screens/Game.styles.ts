import styled from 'styled-components';

export const GameContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 12px;
`;

export const PauseModal = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 20px;
`;

export const PauseTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 8px;
`;

export const PauseButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
`;
