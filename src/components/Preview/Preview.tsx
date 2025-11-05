import { FC, useCallback, useState } from 'react';

import cn from 'classnames';

import { Button } from '../Button';
import { Icon } from '../Icon/Icon';
import styles from './Preview.module.scss';

export interface PreviewProps {
  url: string;
  className?: string;
  onClose?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
}

export const Preview: FC<PreviewProps> = ({ url, className, onClose, onEdit, onOpen }) => {
  const [key, setKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.browserHeader}>
        <div className={styles.windowControls}>
          {onClose && (
            <Button isIcon view="danger" onClick={onClose} aria-label="Close preview">
              <Icon size="s">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
            </Button>
          )}
          {onEdit && (
            <Button isIcon view="action" onClick={onEdit} aria-label="Edit preview">
              <Icon size="s">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                  <path
                    d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                    fill="currentColor"
                  />
                </svg>
              </Icon>
            </Button>
          )}
          {onOpen && (
            <Button isIcon view="success" onClick={onOpen} aria-label="Open preview">
              <Icon size="s">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 3h7v7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3L10 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
            </Button>
          )}
        </div>

        <div className={styles.addressBar}>
          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            aria-label="Refresh"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className={styles.urlDisplay}>{url}</div>
        </div>
      </div>

      <div className={styles.browserContent}>
        <iframe
          key={key}
          src={url}
          className={styles.iframe}
          title="Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default Preview;
