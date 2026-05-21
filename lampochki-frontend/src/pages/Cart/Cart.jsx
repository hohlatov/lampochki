import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from '../../features/cart/cartSlice'
import styles from './Cart.module.css'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((state) => state.cart.items)
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

const updateQty = (id, newQty) => {
  const item = items.find(i => i.id === id);

  if (!item) return;

  if (newQty > item.quantity) {
    dispatch(increaseQuantity(id));
  }

  if (newQty < item.quantity) {
    dispatch(decreaseQuantity(id));
  }
};

const handleRemove = id => {
  dispatch(removeFromCart(id));
};

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <p>Корзина пуста</p>
        <Link to="/catalog" className={styles.goBtn}>Перейти в каталог</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.back}>← На главную</Link>
          <h1 className={styles.title}>Корзина</h1>
        </div>

        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={styles.rowName}>
                <Link to={`/product/${item.id}`} className={styles.itemLink}>{item.name}</Link>
                <span className={styles.itemSub}>Цоколь: {item.base} · «{item.brand}»</span>
              </div>
              <div className={styles.rowQty}>
                <span className={styles.rowLabel}>Количество:</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                >−</button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                  className={styles.qtyInput}
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                >+</button>
                <span className={styles.rowLabel}>шт.</span>
              </div>
              <div className={styles.rowPrice}>
                <span className={styles.rowLabel}>Цена:</span>
                <span className={styles.price}>{(item.price * item.quantity).toFixed(2)} руб.</span>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(item.id)}
                title="Удалить"
              >✕</button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Итого:</span>
            <strong>{total.toFixed(2)} руб.</strong>
          </div>
          <button className={styles.orderBtn} onClick={() => navigate('/order')}>
            Оформить заказ →
          </button>
        </div>
      </div>
    </div>
  )
}