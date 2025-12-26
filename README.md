# Зерно - Каталог кофе

MVP веб-приложение "Vivino for Coffee" на Next.js + Supabase.

## Технологии

- Next.js 15 (App Router, TypeScript)
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS
- Zod для валидации

## Настройка проекта

### 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com) и создайте новый проект
2. Дождитесь завершения инициализации проекта

### 2. Настройка базы данных

1. В панели Supabase перейдите в **SQL Editor**
2. Откройте файл `supabase/schema.sql` и скопируйте его содержимое
3. Вставьте SQL в редактор и выполните запрос (кнопка "Run")

### 3. Настройка Storage

1. В панели Supabase перейдите в **Storage**
2. Создайте новый bucket с именем `lot-images`
3. Настройте политики доступа:
   - **Public bucket**: включите опцию "Public bucket"
   - Или создайте политику для чтения:
     ```sql
     CREATE POLICY "Public Access"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'lot-images');
     ```

### 4. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAILS=admin@example.com,another@example.com
```

Где найти эти значения:
- `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`: **Settings** → **API** → **Project URL** и **anon public key**
- `SUPABASE_SERVICE_ROLE_KEY`: **Settings** → **API** → **service_role secret key** (⚠️ храните в секрете!)
- `ADMIN_EMAILS`: список email адресов через запятую для доступа к админ-панели

### 5. Установка зависимостей и запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
├── app/
│   ├── actions/          # Server actions
│   ├── admin/            # Админ-панель
│   ├── auth/             # Роуты аутентификации
│   ├── lots/             # Страницы лотов
│   ├── login/            # Страница входа
│   ├── profile/          # Страница профиля
│   ├── signup/           # Страница регистрации
│   ├── globals.css       # Глобальные стили
│   ├── layout.tsx        # Корневой layout
│   └── page.tsx          # Главная страница (каталог)
├── components/           # React компоненты
├── lib/
│   └── supabase/         # Supabase клиенты
└── supabase/
    └── schema.sql        # SQL миграции
```

## Основные функции

- **Каталог кофе**: просмотр лотов с фильтрацией и поиском
- **Детальная страница лота**: информация о кофе и отзывы
- **Система отзывов**: пользователи могут оставлять и редактировать отзывы
- **Аутентификация**: регистрация и вход через Supabase Auth
- **Профиль пользователя**: редактирование никнейма и просмотр своих отзывов
- **Админ-панель**: создание новых лотов (только для админов)

## Безопасность

- Row Level Security (RLS) включен для всех таблиц
- Политики доступа настроены в `schema.sql`
- Админ-доступ контролируется через переменную окружения `ADMIN_EMAILS`

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен-версии
npm start

# Линтинг
npm run lint
```



