import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminFetchOrders,
  adminUpdateOrderStatus,
} from '../../api/secureApi'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [editingProduct, setEditingProduct] = useState(null)

  // Форма для товара
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: 0, stock: 0,
    wattage: null, base_type: 'E27', image_url: '',
  })

  // Проверка токена при загрузке
  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      loadData()
    }
  }, [token])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, ordersData] = await Promise.all([
        adminFetchProducts(),
        adminFetchOrders(),
      ])
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Ошибка загрузки:', error)
      if (error.message.includes('401') || error.message.includes('403')) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleCreateProduct = async () => {
    try {
      const newProduct = await adminCreateProduct(productForm)
      setProducts([...products, newProduct])
      setProductForm({ name: '', description: '', price: 0, stock: 0, wattage: null, base_type: 'E27', image_url: '' })
    } catch (error) {
      alert('Ошибка создания: ' + error.message)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      const updated = await adminUpdateProduct(editingProduct.id, productForm)
      setProducts(products.map(p => p.id === updated.id ? updated : p))
      setEditingProduct(null)
      setProductForm({ name: '', description: '', price: 0, stock: 0, wattage: null, base_type: 'E27', image_url: '' })
    } catch (error) {
      alert('Ошибка обновления: ' + error.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Удалить товар?')) return
    try {
      await adminDeleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      alert('Ошибка удаления: ' + error.message)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      wattage: product.wattage,
      base_type: product.base_type,
      image_url: product.image_url || '',
    })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await adminUpdateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? updated : o))
    } catch (error) {
      alert('Ошибка обновления статуса: ' + error.message)
    }
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Панель управления</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
      </div>

      <div className={styles.tabs}>
        <button className={activeTab === 'products' ? styles.active : ''} onClick={() => setActiveTab('products')}>
          Товары
        </button>
        <button className={activeTab === 'orders' ? styles.active : ''} onClick={() => setActiveTab('orders')}>
          Заказы
        </button>
      </div>

      {activeTab === 'products' && (
        <div className={styles.tabContent}>
          {/* Форма добавления/редактирования */}
          <div className={styles.formCard}>
            <h3>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <div className={styles.form}>
              <input type="text" placeholder="Название" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              <textarea placeholder="Описание" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              <input type="number" placeholder="Цена" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
              <input type="number" placeholder="Остаток" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})} />
              <input type="text" placeholder="Цоколь (E27, E14, GU10)" value={productForm.base_type} onChange={e => setProductForm({...productForm, base_type: e.target.value})} />
              <input type="number" placeholder="Мощность (Вт)" value={productForm.wattage || ''} onChange={e => setProductForm({...productForm, wattage: parseInt(e.target.value) || null})} />
              <div className={styles.formActions}>
                {editingProduct ? (
                  <>
                    <button onClick={handleUpdateProduct} className={styles.saveBtn}>Сохранить</button>
                    <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, stock: 0, wattage: null, base_type: 'E27', image_url: '' }) }} className={styles.cancelBtn}>Отмена</button>
                  </>
                ) : (
                  <button onClick={handleCreateProduct} className={styles.createBtn}>Добавить</button>
                )}
              </div>
            </div>
          </div>

          {/* Список товаров */}
          <div className={styles.productList}>
            {products.map(p => (
              <div key={p.id} className={styles.productRow}>
                <div className={styles.productInfo}>
                  <strong>{p.name}</strong>
                  <span>{p.price} руб.</span>
                  <span>Остаток: {p.stock}</span>
                  <span>{p.base_type}</span>
                </div>
                <div className={styles.productActions}>
                  <button onClick={() => handleEditProduct(p)} className={styles.editBtn}>✏️</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className={styles.deleteBtn}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={styles.tabContent}>
          <div className={styles.orderList}>
            {orders.map(o => (
              <div key={o.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>Заказ #{o.id?.slice(0, 8)}</span>
                  <span className={styles.orderDate}>{new Date(o.created_at).toLocaleString()}</span>
                </div>
                <div className={styles.orderInfo}>
                  <div>{o.customer_name}</div>
                  <div>{o.customer_phone}</div>
                  <div>{o.delivery_address}</div>
                  <div className={styles.orderTotal}>{o.total_amount} руб.</div>
                </div>
                <div className={styles.orderItems}>
                  {o.items?.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      {item.product_name} — {item.quantity} шт. × {item.price_at_time} руб.
                    </div>
                  ))}
                </div>
                <div className={styles.orderStatus}>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="new">🆕 Новый</option>
                    <option value="processing">🔄 В обработке</option>
                    <option value="shipped">📦 Отправлен</option>
                    <option value="delivered">✅ Доставлен</option>
                    <option value="cancelled">❌ Отменён</option>
                  </select>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className={styles.empty}>Нет заказов</div>}
          </div>
        </div>
      )}
    </div>
  )
}