import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login, clearError } from '../../features/auth/authSlice'
import styles from './Login.module.css'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login({ username, password }))
    if (login.fulfilled.match(result)) {
      navigate('/admin')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.back}>← На главную</Link>
        <div className={styles.card}>
          <h1 className={styles.title}>Вход в панель управления</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  dispatch(clearError())
                }}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  dispatch(clearError())
                }}
                required
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <p className={styles.hint}>
            Тестовые данные: admin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}