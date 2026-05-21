import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { loadProducts } from '../../features/products/productsSlice'
import styles from './Catalog.module.css'

const BASES = ['Все', 'E27', 'E14', 'GU10']
const BRANDS = ['Все', 'Ёлки петролиум', 'СветоФарм', 'ЛюксЛайт']
const KELVIN = [
  { label: 'Все', value: 'all' },
  { label: 'Тёплый (до 3000К)', value: 'warm' },
  { label: 'Нейтральный (3001–4500К)', value: 'neutral' },
  { label: 'Холодный (от 4501К)', value: 'cold' },
]

export default function Catalog() {
  const dispatch = useDispatch()
  const { items: products, loading, error } = useSelector((state) => state.products)

  const [base, setBase] = useState('Все')
  const [brand, setBrand] = useState('Все')
  const [kelvin, setKelvin] = useState('all')
  const [maxPrice, setMaxPrice] = useState(1000)

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  const filtered = (products || []).filter((p) => {
    if (base !== 'Все' && p.base !== base) return false
    if (brand !== 'Все' && p.brand !== brand) return false
    if (p.price > maxPrice) return false
    if (kelvin === 'warm' && p.kelvin > 3000) return false
    if (kelvin === 'neutral' && (p.kelvin <= 3000 || p.kelvin > 4500)) return false
    if (kelvin === 'cold' && p.kelvin <= 4500) return false
    return true
  })

  if (loading) return <div className={styles.page}>Загрузка...</div>
  if (error) return <div className={styles.page}>Ошибка: {error}</div>

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h3 className={styles.filterTitle}>Фильтры</h3>
        {/* ... фильтры (без изменений) ... */}
      </aside>
      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.backLink}>← На главную</Link>
          <span className={styles.count}>Найдено: {filtered.length} товаров</span>
        </div>
        {filtered.length === 0 ? (
          <div className={styles.empty}>Нет товаров по выбранным фильтрам</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}