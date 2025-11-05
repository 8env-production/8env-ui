import { useState } from 'react';

import styles from './WithLeftResizer.module.css';

import { ResizableDiv } from '../../ResizableDiv';
import type { ResizableDivProps } from '../../types';

type WithLeftResizerProps = ResizableDivProps;

export const WithLeftResizerComponent = (args: WithLeftResizerProps) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [currentWidth, setCurrentWidth] = useState(args.initialWidth || 35);
    const [persistenceEnabled, setPersistenceEnabled] = useState(true);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
    };

    const clearSavedData = () => {
        localStorage.removeItem('storybook-left-resizer-panel');
        addLog('Сохраненные данные очищены из localStorage');
    };

    const togglePersistence = () => {
        setPersistenceEnabled(!persistenceEnabled);
        if (!persistenceEnabled) {
            addLog('Автосохранение включено');
        } else {
            addLog('Автосохранение отключено');
            clearSavedData();
        }
    };

    return (
        <ResizableDiv
            {...args}
            resizerPosition="left"
            persistenceKey={
                persistenceEnabled ? 'storybook-left-resizer-panel' : undefined
            }
            onWidthChange={(width) => {
                setCurrentWidth(width);
                const message = persistenceEnabled
                    ? `Ширина изменена и сохранена: ${width.toFixed(1)}%`
                    : `Ширина изменена: ${width.toFixed(1)}%`;
                addLog(message);
                args.onWidthChange?.(width);
            }}
            onResizeStart={(width) => {
                addLog(`Начало изменения размера: ${width.toFixed(1)}%`);
                args.onResizeStart?.(width);
            }}
            onResizeEnd={(width) => {
                addLog(`Завершение изменения размера: ${width.toFixed(1)}%`);
                args.onResizeEnd?.(width);
            }}
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Панель с левым ресайзером</h2>

                <div className={styles.currentWidthBlock}>
                    <strong>Текущая ширина:</strong> {currentWidth.toFixed(1)}%
                </div>

                <div className={styles.resizerInfo}>
                    <div className={styles.resizerIndicator}>
                        ← Ресайзер слева
                    </div>
                    <p className={styles.resizerDescription}>
                        Попробуйте перетащить левую границу панели для изменения
                        ширины. Также можно использовать клавиши ← и → для
                        точной настройки.
                    </p>
                </div>

                <div className={styles.persistenceSection}>
                    <h3 className={styles.persistenceTitle}>
                        💾 Автосохранение
                    </h3>
                    <div className={styles.persistenceControls}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={persistenceEnabled}
                                onChange={togglePersistence}
                                className={styles.checkbox}
                            />
                            Сохранять ширину в localStorage
                        </label>
                        {persistenceEnabled && (
                            <div className={styles.persistenceInfo}>
                                <small>
                                    Ключ: storybook-left-resizer-panel
                                </small>
                                <button
                                    onClick={clearSavedData}
                                    className={styles.clearButton}
                                >
                                    Очистить данные
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.logsSection}>
                    <h3 className={styles.logsTitle}>Журнал событий:</h3>
                    <div className={styles.logsContainer}>
                        {logs?.length === 0 ? (
                            <div className={styles.emptyLogsMessage}>
                                Начните изменять размер панели...
                            </div>
                        ) : (
                            logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`${styles.logEntry} ${
                                        index === 0
                                            ? styles.logEntryLatest
                                            : styles.logEntryOld
                                    }`}
                                >
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </ResizableDiv>
    );
};
