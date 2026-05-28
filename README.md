# Лампочки — итоговый проект интернет-магазина

Monorepo с frontend и микросервисами backend.

## Состав проекта

- `lampochki-frontend` — пользовательский интерфейс (каталог, корзина, оформление заказа) и админ-панель.
- `lampochki_microservices/products_service` — микросервис управления товарами.
- `lampochki_microservices/orders_service` — микросервис управления заказами.
- `lampochki_microservices/auth_service` — микросервис панели управления (аутентификация менеджера и выдача JWT для админ-операций).

## Что реализовано 

- Пользователь: просмотр товаров, добавление в корзину, оформление заказа.
- Менеджер: вход по логину/паролю, управление товарами (CRUD), управление заказами (просмотр, смена статусов).
- Микросервисная архитектура: товары, заказы, панель управления (auth/JWT).

## Быстрый запуск 

Из корня репозитория:

.\start.ps1

Сервисы:

- frontend: http://localhost:5173
- products: http://localhost:8000/docs
- orders: http://localhost:8001/docs
- admin/auth: http://localhost:8002/docs

Админ вход:

- URL: http://localhost:5173/login
- login: `admin`
- password: `admin123`

