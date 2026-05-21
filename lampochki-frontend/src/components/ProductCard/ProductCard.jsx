import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'
import LampSvg from '../LampSvg'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAdd = () => {
    dispatch(addToCart(product))
  }

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imgWrap}>
        <LampSvg kelvin={product.kelvin} />
      </Link>
      <div className={styles.info}>
        <Link to={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
        <span className={styles.base}>Цоколь: {product.base}</span>
        <span className={styles.brand}>«{product.brand}»</span>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toFixed(2)} руб.</span>
          <button className={styles.btn} onClick={handleAdd}>В корзину</button>
        </div>
      </div>
    </div>
  )
}