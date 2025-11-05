import { FC } from 'react';

import Link from 'next/link';

import styles from './Logo.module.css';

export const Logo: FC = () => {
    return <Link className={styles.link} href="/" />;
};
