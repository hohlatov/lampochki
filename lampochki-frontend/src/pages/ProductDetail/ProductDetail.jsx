import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import LampSvg from '../../components/LampSvg'
import { loadProducts } from '../../features/products/productsSlice'
import { addToCart } from '../../features/cart/cartSlice'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((state) => state.products)
  const product = products.find((p) => p.id === Number(id))
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(loadProducts())
    }
  }, [dispatch, products.length])

  const handleAdd = () => {
    if (product) {
      dispatch(addToCart(product))
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  if (loading) return <div className={styles.page}>Загрузка...</div>
  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>Товар не найден</p>
        <Link to="/catalog">← Вернуться в каталог</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/catalog" className={styles.back}>← Вернуться в каталог</Link>
        <div className={styles.card}>
          <div className={styles.imgWrap}>
            <LampSvg kelvin={product.kelvin} size={160} />
          </div>
          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.base}>Цоколь: <strong>{product.base}</strong></p>
            {/* ... остальные характеристики ... */}
            <button
              className={`${styles.addBtn} ${added ? styles.added : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Добавлено!' : 'Добавить в корзину'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}