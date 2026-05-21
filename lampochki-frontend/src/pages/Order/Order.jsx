import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearCart, selectCartTotal } from '../../features/cart/cartSlice'
import { addOrder } from '../../features/orders/ordersSlice'
import styles from './Order.module.css'

function genOrderId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export default function Order() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const total = useSelector(selectCartTotal)

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '' })
  const [errors, setErrors] = useState({})
  const orderId = useState(genOrderId)[0]

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Корзина пуста. Нельзя оформить заказ.</p>
        <Link to="/catalog" className={styles.goBtn}>В каталог</Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Введите ФИО'
    if (!form.phone.trim()) e.phone = 'Введите телефон'
    if (!form.email.trim()) e.email = 'Введите email'
    if (!form.address.trim()) e.address = 'Введите адрес доставки'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    // Сохраняем заказ в Redux
    dispatch(addOrder({
      id: orderId,
      items,
      total,
      customer: form,
      date: new Date().toISOString(),
    }))
    dispatch(clearCart())
    navigate('/confirmation', { state: { orderId, total, form } })
  }

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/cart" className={styles.back}>← Вернуться в корзину</Link>
        <div className={styles.card}>
          <div className={styles.summary}>
            <h2 className={styles.orderNum}>Заказ № {orderId}</h2>
            <p className={styles.totalLabel}>На общую сумму:</p>
            <p className={styles.totalAmount}>{total.toFixed(2)} руб.</p>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.name}</span>
                  <span className={styles.summaryQty}>
                    {item.quantity} шт. × {item.price} руб.
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.form}>
            {/* ... поля формы без изменений ... */}
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Подтвердить заказ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}