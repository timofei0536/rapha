import styles from './Header.module.scss';
import Link from "next/link";


export default function Header() {
  return (
      <header className={styles.header}>
        <h1 className={styles.logo}>Header</h1>

        <nav>
          <Link href="/">Главная</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

  );
}