import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './Icon.module.css';

export type IconProps = {
    // Default size is 'm'
    size: 's' | 'm' | 'l';
} & PropsWithChildren;

export const Icon: FC<IconProps> = ({ size = 'm', children }) => {
    return (
        <span className={cn(styles.root, { [styles[`size_${size}`]]: size })}>
            {children}
        </span>
    );
};
