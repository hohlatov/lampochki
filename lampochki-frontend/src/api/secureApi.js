const PRODUCTS_URL = 'http://localhost:8000'
const ORDERS_URL = 'http://localhost:8001'

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

// Товары (админские эндпоинты)
export async function adminFetchProducts() {
  const response = await fetch(`${PRODUCTS_URL}/admin/products`, {
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error(`${response.status}: Ошибка загрузки товаров`)
  return response.json()
}

export async function adminCreateProduct(product) {
  const response = await fetch(`${PRODUCTS_URL}/admin/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(product),
  })
  if (!response.ok) throw new Error('Ошибка создания товара')
  return response.json()
}

export async function adminUpdateProduct(id, product) {
  const response = await fetch(`${PRODUCTS_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(product),
  })
  if (!response.ok) throw new Error('Ошибка обновления товара')
  return response.json()
}

export async function adminDeleteProduct(id) {
  const response = await fetch(`${PRODUCTS_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error('Ошибка удаления товара')
}

// Заказы (админские эндпоинты)
export async function adminFetchOrders() {
  const response = await fetch(`${ORDERS_URL}/admin/orders/`, {
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error('Ошибка загрузки заказов')
  return response.json()
}

export async function adminUpdateOrderStatus(orderId, status) {
  const response = await fetch(`${ORDERS_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Ошибка обновления статуса')
  return response.json()
}