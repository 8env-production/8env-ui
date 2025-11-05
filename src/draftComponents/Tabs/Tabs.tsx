import { Children, FC, ReactNode, isValidElement, useState } from 'react';

import cn from 'classnames';

import styles from './Tabs.module.css';

export interface TabProps {
    label: string;
    value: string;
    disabled?: boolean;
    children: ReactNode;
}

export interface TabsProps {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    children: ReactNode;
}

export const Tab: FC<TabProps> = ({ children }) => {
    return <>{children}</>;
};

export const Tabs: FC<TabsProps> = ({
    defaultValue,
    value: controlledValue,
    onChange,
    variant = 'default',
    size = 'medium',
    fullWidth = false,
    children,
}) => {
    const [internalValue, setInternalValue] = useState<string>(
        defaultValue || ''
    );

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Извлекаем табы из children
    const tabs = Children.toArray(children).filter(
        (child) => isValidElement(child) && child.type === Tab
    ) as React.ReactElement<TabProps>[];

    // Если нет активного таба, устанавливаем первый
    const activeValue = currentValue || tabs[0]?.props.value || '';

    const handleTabClick = (tabValue: string, disabled?: boolean) => {
        if (disabled) return;

        if (isControlled) {
            onChange?.(tabValue);
        } else {
            setInternalValue(tabValue);
            onChange?.(tabValue);
        }
    };

    const activeTab = tabs.find((tab) => tab.props.value === activeValue);

    const tabListClassNames = cn(styles.tabList, {
        [styles[`variant_${variant}`]]: variant,
        [styles[`size_${size}`]]: size,
        [styles.fullWidth]: fullWidth,
    });

    return (
        <div className={styles.root}>
            <div className={tabListClassNames} role="tablist">
                {tabs.map((tab) => {
                    const { label, value: tabValue, disabled } = tab.props;
                    const isActive = tabValue === activeValue;

                    const tabClassNames = cn(styles.tab, {
                        [styles.active]: isActive,
                        [styles.disabled]: disabled,
                        [styles[`tabSize_${size}`]]: size,
                    });

                    return (
                        <button
                            key={tabValue}
                            className={tabClassNames}
                            role="tab"
                            aria-selected={isActive}
                            aria-disabled={disabled}
                            disabled={disabled}
                            onClick={() => handleTabClick(tabValue, disabled)}
                            type="button"
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
            <div className={styles.tabPanel} role="tabpanel">
                {activeTab?.props.children}
            </div>
        </div>
    );
};

Tabs.displayName = 'Tabs';
Tab.displayName = 'Tab';
