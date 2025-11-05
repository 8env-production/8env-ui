import { FC } from 'react';

import Link from 'next/link';

import styles from './UserPic.module.css';

export type UserPicProps = {
    imgUrl: string;
};

export const UserPic: FC<UserPicProps> = ({ imgUrl }) => {
    return (
        <Link
            className={styles.link}
            href="/auth"
            style={{
                backgroundImage: `url("${imgUrl}")`,
            }}
        />
    );
};
