import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
    return (
        <footer className={styles.footer} {...rest}>
            &copy; Pokemon Trading Cards, {new Date().getFullYear()}
        </footer>
    )
}

export default Footer;