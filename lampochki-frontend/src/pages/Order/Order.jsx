import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearCart, selectCartTotal } from '../../features/cart/cartSlice'
import { createOrder } from '../../api/ordersApi'
import styles from './Order.module.css'

export default function Order() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const total = useSelector(selectCartTotal)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'card',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const result = await createOrder({
        customer_name: form.fullName.trim(),
        customer_phone: form.phone.trim(),
        delivery_address: `${form.address.trim()} (email: ${form.email.trim()})`,
        payment_method: form.paymentMethod,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      })

      dispatch(clearCart())
      navigate('/confirmation', {
        state: {
          orderId: result.order_id,
          total: result.total_amount,
          form,
        },
      })
    } catch (error) {
      setErrors({ submit: error.message || 'Не удалось оформить заказ' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }))
    setErrors((prev) => ({ ...prev, [field]: undefined, submit: undefined }))
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/cart" className={styles.back}>← Вернуться в корзину</Link>
        <div className={styles.card}>
          <div className={styles.summary}>
            <h2 className={styles.orderNum}>Ваш заказ</h2>
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
            <div className={styles.field}>
              <label>ФИО</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={errors.fullName ? styles.inputErr : ''}
              />
              {errors.fullName && <span className={styles.err}>{errors.fullName}</span>}
            </div>
            <div className={styles.field}>
              <label>Телефон</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? styles.inputErr : ''}
              />
              {errors.phone && <span className={styles.err}>{errors.phone}</span>}
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? styles.inputErr : ''}
              />
              {errors.email && <span className={styles.err}>{errors.email}</span>}
            </div>
            <div className={styles.field}>
              <label>Адрес доставки</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={errors.address ? styles.inputErr : ''}
              />
              {errors.address && <span className={styles.err}>{errors.address}</span>}
            </div>
            <div className={styles.field}>
              <label>Способ оплаты</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--c-border)' }}
              >
                <option value="card">Банковская карта</option>
                <option value="cash">Наличные при получении</option>
                <option value="transfer">Перевод</option>
              </select>
            </div>
            {errors.submit && <div className={styles.err}>{errors.submit}</div>}
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Оформление...' : 'Подтвердить заказ →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
