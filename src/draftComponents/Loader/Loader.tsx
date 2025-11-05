import { FC } from 'react';

import cn from 'classnames';

import styles from './Loader.module.css';

export type LoaderProps = {
    // Default: m
    size?: 's' | 'm' | 'l' | 'xl';
};

export const Loader: FC<LoaderProps> = ({ size = 'm' }) => {
    return (
        <div className={cn(styles.root, { [styles[`size_${size}`]]: size })} />
    );
};
