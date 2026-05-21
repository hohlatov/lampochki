const PRODUCTS_URL = 'http://localhost:8000/products'

export async function fetchProducts() {
  const response = await fetch(PRODUCTS_URL)

  if (!response.ok) {
    throw new Error('Ошибка загрузки товаров')
  }

  return response.json()
}