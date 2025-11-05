import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import ReactDOM from 'react-dom';
import cn from 'classnames';

import styles from './Modal.module.scss';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type PortalContainer = HTMLElement | null | (() => HTMLElement | null);

export type ModalSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps extends PropsWithChildren {
  /**
   * Открыто ли модальное окно
   */
  isOpen: boolean;
  /**
   * Колбэк закрытия модального окна
   */
  onClose: () => void;
  /**
   * Заголовок модального окна
   */
  title?: ReactNode;
  /**
   * Описание/подзаголовок модального окна
   */
  description?: ReactNode;
  /**
   * Подвал модального окна (например, кнопки действий)
   */
  footer?: ReactNode;
  /**
   * Кастомный хедер. Если не задан, будет использован заголовок и описание
   */
  header?: ReactNode;
  /**
   * ARIA label, если не передан title
   */
  ariaLabel?: string;
  /**
   * Размер модального окна
   */
  size?: ModalSize;
  /**
   * Включить/отключить закрытие при клике по оверлею
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Включить/отключить закрытие по клавише Escape
   * @default true
   */
  closeOnEsc?: boolean;
  /**
   * Блокировать прокрутку body при открытом модальном окне
   * @default true
   */
  disableBodyScroll?: boolean;
  /**
   * Скрыть кнопку закрытия
   * @default false
   */
  hideCloseButton?: boolean;
  /**
   * Текст метки для кнопки закрытия
   * @default 'Закрыть модальное окно'
   */
  closeButtonLabel?: string;
  /**
   * Кастомный контейнер для портала
   */
  portalContainer?: PortalContainer;
  /**
   * Дополнительный className для диалога
   */
  className?: string;
  /**
   * Дополнительный className для оверлея
   */
  overlayClassName?: string;
  /**
   * Дополнительный className для контента (body)
   */
  bodyClassName?: string;
  /**
   * Дополнительный className для футера
   */
  footerClassName?: string;
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

const getFocusableElements = (node: HTMLElement | null) => {
  if (!node) return [] as HTMLElement[];
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
  );
};

const resolveContainer = (input?: PortalContainer): HTMLElement | null => {
  if (!input) return null;
  if (typeof input === 'function') {
    return input();
  }
  return input;
};

export const Modal = (props: ModalProps) => {
  const {
    isOpen,
    onClose,
    title,
    description,
    footer,
    header,
    ariaLabel,
    size = 'auto',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    disableBodyScroll = true,
    hideCloseButton = false,
    closeButtonLabel = 'Закрыть модальное окно',
    portalContainer,
    className,
    overlayClassName,
    bodyClassName,
    footerClassName,
    children,
  } = props;

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  // Определяем контейнер портала
  useEffect(() => {
    if (!isBrowser) return;

    const providedContainer = resolveContainer(portalContainer);
    let container = providedContainer;
    let createdByHook = false;

    if (!container) {
      container =
        document.getElementById('modal-root') ||
        document.getElementById('8env-ui-modal-root');
    }

    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', '8env-ui-modal-root');
      document.body.appendChild(container);
      createdByHook = true;
    }

    setMountNode(container);

    return () => {
      if (createdByHook && container && container.childElementCount === 0) {
        container.remove();
      }
    };
  }, [portalContainer]);

  // Обработка закрытия по Escape
  useEffect(() => {
    if (!isBrowser || !isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Блокировка прокрутки body
  useEffect(() => {
    if (!isBrowser || !disableBodyScroll) return;

    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [isOpen, disableBodyScroll]);

  // Управление фокусом
  useEffect(() => {
    if (!isBrowser || !isOpen) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    const focusDialog = () => {
      const focusableElements = getFocusableElements(dialog);

      if (!hideCloseButton && closeButtonRef.current) {
        closeButtonRef.current.focus({ preventScroll: true });
        return;
      }

      if (focusableElements.length > 0) {
        focusableElements[0].focus({ preventScroll: true });
        return;
      }

      dialog.focus({ preventScroll: true });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(dialog);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isShiftPressed = event.shiftKey;

      if (!isShiftPressed && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      } else if (isShiftPressed && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
      }
    };

    const scheduleFrame =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 16);

    const cancelFrame =
      typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
        ? window.cancelAnimationFrame.bind(window)
        : ((handle: number) => window.clearTimeout(handle)) as unknown as typeof window.cancelAnimationFrame;

    const frameHandle = scheduleFrame(focusDialog);
    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      cancelFrame(frameHandle);

      previouslyFocusedElementRef.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, hideCloseButton]);

  const handleOverlayMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnOverlayClick) {
        return;
      }

      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  const sizeClassName = useMemo(() => {
    const sizeMap: Record<ModalSize, string> = {
      auto: styles.sizeAuto,
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
      xl: styles.sizeXl,
      full: styles.sizeFull,
    };
    return sizeMap[size];
  }, [size]);

  const dialogClassName = cn(styles.dialog, sizeClassName, className);
  const bodyClasses = cn(styles.body, bodyClassName);
  const footerClasses = cn(styles.footer, footerClassName);
  const overlayClasses = cn(styles.overlay, overlayClassName);

  if (!isBrowser || !isOpen || !mountNode) {
    return null;
  }

  const labelledBy = title ? titleId : undefined;
  const describedBy = description ? descriptionId : undefined;
  const ariaLabelValue = !title && ariaLabel ? ariaLabel : undefined;

  const modalContent = (
    <div className={overlayClasses} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-label={ariaLabelValue}
        tabIndex={-1}
        className={dialogClassName}
      >
        {!hideCloseButton && (
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            aria-label={closeButtonLabel}
            onClick={onClose}
          >
            <span aria-hidden="true" className={styles.closeIcon}>
              ×
            </span>
          </button>
        )}

        {(header || title || description) && (
          <header className={styles.header}>
            {header ?? (
              <>
                {title && (
                  <h2 id={titleId} className={styles.heading}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className={styles.description}>
                    {description}
                  </p>
                )}
              </>
            )}
          </header>
        )}

        <div className={bodyClasses}>{children}</div>

        {footer && <footer className={footerClasses}>{footer}</footer>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, mountNode);
};

Modal.displayName = 'Modal';