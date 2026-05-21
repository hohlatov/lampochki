const ORDERS_URL = 'http://localhost:8001/orders'

export async function createOrder(orderData) {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Ошибка создания заказа')
  }

  return response.json()
}