import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
 
import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
    return (
        <header className={styles.header}>
            <Container className={styles.headerContainer}>
                <p className={styles.headerTitle}>
                    <Link href="/">
                        <a>
                            Pokemon Trading Cards
                        </a>
                    </Link>
                </p>
                <p className={styles.headerCart}>
                    <FaShoppingCart />
                    £0.0
                </p>
            </Container>
        </header>
    )
}

export default Header;