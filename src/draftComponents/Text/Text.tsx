import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './Text.module.css';

export type TextProps = {
    //  Default value: "body"
    variant?: 'title' | 'body' | 'secondary' | 'caption' | 'tiny';
    //  Default value: "default"
    color?: 'default' | 'contrast' | 'brand';
    isUppercase?: boolean;
    textOverflow?: 'ellipsis';
    withIcon?: boolean;
    isItalic?: boolean;
} & PropsWithChildren;

export const Text: FC<TextProps> = ({
    variant = 'body',
    color = 'default',
    isUppercase,
    textOverflow,
    children,
    withIcon,
    isItalic,
}) => {
    const className = cn(styles.root, {
        [styles.title]: variant === 'title',
        [styles.body]: variant === 'body',
        [styles.secondary]: variant === 'secondary',
        [styles.tiny]: variant === 'tiny',
        [styles.caption]: variant === 'caption',
        [styles.uppercase]: isUppercase,
        [styles.ellipsis]: textOverflow === 'ellipsis',
        [styles[`color_${color}`]]: Boolean(color),
        [styles.withIcon]: withIcon,
        [styles.italic]: isItalic,
    });

    switch (variant) {
        case 'title':
            return <h1 className={className}>{children}</h1>;
        case 'caption':
            return <h3 className={className}>{children}</h3>;
        case 'secondary':
            return <span className={className}>{children}</span>;
        default:
        case 'body':
            return <p className={className}>{children}</p>;
    }
};
