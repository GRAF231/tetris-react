/**
 * Утилиты для анимаций
 */
import { ANIMATIONS } from '../constants/gameConfig';

/**
 * Промис, который разрешается через указанное количество миллисекунд
 * @param ms Время задержки в миллисекундах
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Промис, который разрешается в следующем анимационном кадре
 */
export function nextFrame(): Promise<number> {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Последовательно выполняет анимации с задержкой
 * @param animations Массив функций-анимаций, возвращающих промисы
 * @param delayBetween Задержка между анимациями в миллисекундах
 */
export async function sequentialAnimate(
    animations: Array<() => Promise<unknown>>,
    delayBetween: number = 0
): Promise<void> {
    for (let i = 0; i < animations.length; i++) {
        await animations[i]();
        if (i < animations.length - 1 && delayBetween > 0) {
            await delay(delayBetween);
        }
    }
}

/**
 * Параллельно выполняет анимации
 * @param animations Массив функций-анимаций, возвращающих промисы
 */
export function parallelAnimate(animations: Array<() => Promise<unknown>>): Promise<unknown[]> {
    return Promise.all(animations.map((anim) => anim()));
}

/**
 * Создает анимацию всплывающего текста счета
 * @param element HTML-элемент для анимации
 * @param score Очки для отображения
 */
export async function animateScorePopup(element: HTMLElement, score: number): Promise<void> {
    // Настраиваем начальные стили
    Object.assign(element.style, {
        opacity: '0',
        transform: 'translateY(0) scale(0.8)',
        transition: `all ${ANIMATIONS.SCORE_POPUP / 1000}s ease-out`,
    });

    element.textContent = `+${score}`;

    // Ждем следующий кадр для применения CSS-transition
    await nextFrame();

    // Применяем анимацию
    Object.assign(element.style, {
        opacity: '1',
        transform: 'translateY(-30px) scale(1.2)',
    });

    // Ждем завершения анимации
    await delay(ANIMATIONS.SCORE_POPUP);

    // Скрываем элемент
    Object.assign(element.style, {
        opacity: '0',
        transform: 'translateY(-60px) scale(0.8)',
    });

    // Ждем завершения анимации исчезновения
    await delay(ANIMATIONS.SCORE_POPUP / 2);
}

/**
 * Создает анимацию подсветки линий, которые будут очищены
 * @param rowElements Массив элементов строк
 * @param colElements Массив элементов столбцов
 */
export async function animateLineHighlight(
    rowElements: HTMLElement[],
    colElements: HTMLElement[]
): Promise<void> {
    const allElements = [...rowElements, ...colElements];

    // Добавляем класс для подсветки
    allElements.forEach((el) => el.classList.add('highlight'));

    // Ждем завершения анимации
    await delay(ANIMATIONS.LINE_CLEAR / 2);

    // Удаляем класс
    allElements.forEach((el) => el.classList.remove('highlight'));
}

/**
 * Создает анимацию очистки линий
 * @param cellElements Массив элементов ячеек для очистки
 */
export async function animateLineClear(cellElements: HTMLElement[]): Promise<void> {
    // Добавляем класс для анимации
    cellElements.forEach((el) => el.classList.add('clearing'));

    // Ждем завершения анимации
    await delay(ANIMATIONS.LINE_CLEAR);

    // Удаляем класс и очищаем ячейки
    cellElements.forEach((el) => {
        el.classList.remove('clearing');
        el.classList.remove('filled');
        el.style.backgroundColor = '';
    });
}
