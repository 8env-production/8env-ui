import { FC, PropsWithChildren, useEffect } from 'react';

import ReactDOM from 'react-dom';

import styles from './Modal.module.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalClientComponent: FC<PropsWithChildren<ModalProps>> = ({
    isOpen,
    onClose,
    children,
}) => {
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        // Отключаем прокрутку фона при открытой модалке
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleBackgroundClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !modalRoot) return null;

    return ReactDOM.createPortal(
        <div
            className={styles.modalOverlay}
            onMouseDown={handleBackgroundClick}
        >
            <div className={styles.modalContent}>{children}</div>
        </div>,
        modalRoot
    );
};

export const Modal: FC<PropsWithChildren<ModalProps>> = (props) => {
    try {
        if (!window) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }

    return <ModalClientComponent {...props} />;
};
