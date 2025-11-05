import { FC } from 'react';

import styles from './Navigation.module.css';

import { Logo, UserPic, type UserPicProps } from '@/shared/components';

const BorderSVG = () => (
    <svg
        viewBox="0 0 56 29"
        fill="var(--color-brand)"
        style={{
            transform: 'rotate(180deg)',
            display: 'block',
            position: 'relative',
            top: '2px',
        }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            style={{ boxShadow: '0 0 2px var(--color-brand)' }}
            d="M56 0v29c-.8-1-7-6.1-17.7-8.4L13 15.7A16 16 0 0 1 0 0Z"
        />
    </svg>
);

export type NavigationProps = {
    userPicProps: UserPicProps;
};

export const Navigation: FC<NavigationProps> = ({ userPicProps }) => {
    return (
        <div className={styles.root}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <Logo />
                </div>
            </div>
            <div className={styles.bottom}>
                <BorderSVG />
                <div className={styles.bottomContent}>
                    <div className={styles.user}>
                        <UserPic {...userPicProps} />
                    </div>
                </div>
            </div>
        </div>
    );
};
