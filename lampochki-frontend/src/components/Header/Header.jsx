import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartTotalCount } from '../../features/cart/cartSlice'
import styles from './Header.module.css'

export default function Header() {
  const totalCount = useSelector(selectCartTotalCount)

  return (
    <header className={styles.wrap}>
      <div className={styles.topBar}>
        <span>📍 Ваш город: Москва</span>
      </div>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>💡</span>
          <span className={styles.logoText}>ЛампоЗавод</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/catalog">Каталог</Link>
          <Link to="/#promo">Акции</Link>
          <Link to="/#reviews">Отзывы</Link>
          <Link to="/#contacts">Контакты</Link>
          <Link to="/cart" className={styles.cartLink}>
            Корзина {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
          </Link>
          <Link to="/login">Админ</Link>
        </nav>
      </div>
    </header>
  )
}