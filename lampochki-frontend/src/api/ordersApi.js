const ORDERS_URL = 'http://localhost:8001/orders/'

export async function createOrder(orderData) {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail = data.detail
    const message = Array.isArray(detail)
      ? detail.map((e) => e.msg).join(', ')
      : typeof detail === 'string'
        ? detail
        : 'Ошибка создания заказа'
    throw new Error(message)
  }

  return data
}
