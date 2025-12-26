# Пошаговая настройка Supabase

## Шаг 1: Создание проекта Supabase

1. Откройте https://supabase.com/dashboard
2. Нажмите "New Project"
3. Заполните:
   - **Name**: zerno (или любое другое)
   - **Database Password**: придумайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
4. Нажмите "Create new project"
5. Дождитесь завершения инициализации (2-3 минуты)

## Шаг 2: Получение ключей API

1. В панели проекта перейдите в **Settings** → **API**
2. Скопируйте следующие значения:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** key (длинная строка, начинается с `eyJ...`)
   - **service_role** key (длинная строка, начинается с `eyJ...`) - ⚠️ **НЕ ДЕЛИТЕСЬ ЭТИМ КЛЮЧОМ!**

## Шаг 3: Настройка базы данных

1. В панели Supabase перейдите в **SQL Editor**
2. Нажмите "New query"
3. Откройте файл `supabase/schema.sql` в этом проекте
4. Скопируйте **весь** содержимое файла
5. Вставьте в SQL Editor
6. Нажмите "Run" (или Ctrl+Enter)
7. Должно появиться сообщение "Success. No rows returned"

## Шаг 4: Настройка Storage

1. В панели Supabase перейдите в **Storage**
2. Нажмите "Create bucket"
3. Заполните:
   - **Name**: `lot-images`
   - **Public bucket**: ✅ включите (чтобы изображения были доступны публично)
4. Нажмите "Create bucket"

## Шаг 5: Настройка переменных окружения

Откройте файл `.env.local` в корне проекта и заполните:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
ADMIN_EMAILS=ваш@email.com
```

**Важно:**
- Замените `ваш-проект`, `ваш_anon_key`, `ваш_service_role_key` на реальные значения из шага 2
- В `ADMIN_EMAILS` укажите email, который вы будете использовать для регистрации (через запятую, если несколько)

## Шаг 6: Перезапуск приложения

После настройки `.env.local`:

1. Остановите сервер (Ctrl+C в терминале)
2. Запустите снова: `npm run dev`

## Проверка

Откройте http://localhost:3000 - должно отображаться "Каталог кофе" вместо сообщения об ошибке.

## Полезные ссылки

- Dashboard: https://supabase.com/dashboard
- Документация: https://supabase.com/docs



