import { useLocation, Link } from 'react-router-dom';
import styles from './Confirmation.module.css';

export default function Confirmation() {
  const { state } = useLocation();

  if (!state) return (
    <div className={styles.empty}>
      <p>Страница недоступна.</p>
      <Link to="/" className={styles.goBtn}>На главную</Link>
    </div>
  );

  const { orderId, total, form } = state;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.back}>← На главную</Link>

        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <span className={styles.icon}>✅</span>
          </div>
          <h1 className={styles.title}>Заказ оформлен!</h1>
          <p className={styles.subtitle}>Спасибо за покупку. Мы скоро свяжемся с вами.</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Номер заказа</span>
              <span className={styles.detailValue}>{orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Сумма заказа</span>
              <span className={styles.detailValue}>{total.toFixed(2)} руб.</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Получатель</span>
              <span className={styles.detailValue}>{form.fullName}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Телефон</span>
              <span className={styles.detailValue}>{form.phone}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{form.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Адрес доставки</span>
              <span className={styles.detailValue}>{form.address}</span>
            </div>
          </div>

          <Link to="/catalog" className={styles.continueBtn}>Продолжить покупки</Link>
        </div>
      </div>
    </div>
  );
}
