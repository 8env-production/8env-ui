import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './SolidLoader.module.css';

import { Loader } from '@/shared/components';

export type SolidLoaderProps = {
    isLoading: boolean;
    className?: string;
} & PropsWithChildren;

export const SolidLoader: FC<SolidLoaderProps> = ({
    children,
    isLoading,
    className,
}) => {
    return (
        <div className={cn(styles.root, className)}>
            <div className={cn(styles.loader, { [styles.hidden]: !isLoading })}>
                <Loader />
            </div>
            {children}
        </div>
    );
};
