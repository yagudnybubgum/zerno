# Решение проблем с регистрацией

## Ошибка: "Forbidden use of secret API key in browser"

Эта ошибка означает, что в браузер попадает `SUPABASE_SERVICE_ROLE_KEY` вместо `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Причина

В Coolify неправильно настроены переменные окружения или используется неправильный ключ.

### Решение

1. **Проверьте переменные окружения в Coolify:**

   Убедитесь, что у вас есть **ТОЧНО** эти переменные (с правильными именами):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
   SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
   ADMIN_EMAILS=ваш@email.com
   ```

2. **Важно:**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` должен быть **anon public** ключом (НЕ service_role!)
   - `SUPABASE_SERVICE_ROLE_KEY` должен быть **service_role** ключом
   - Оба ключа должны быть из раздела **Settings → API** в Supabase

3. **Проверьте, что вы используете правильные ключи:**

   В Supabase Dashboard → Settings → API:
   - **anon public** → это `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → это `SUPABASE_SERVICE_ROLE_KEY`

4. **Убедитесь, что переменные сохранены:**
   - В Coolify переменные должны быть видны в списке
   - Проверьте, что нет опечаток в названиях
   - Убедитесь, что значения скопированы полностью (без лишних пробелов)

5. **Перезапустите приложение:**
   - После изменения переменных окружения
   - Нажмите **Redeploy** в Coolify
   - Дождитесь завершения деплоя

6. **Очистите кеш браузера:**
   - Нажмите `Ctrl+Shift+R` (Windows/Linux) или `Cmd+Shift+R` (Mac)
   - Или откройте сайт в режиме инкогнито

## Как проверить, что переменные правильные

1. Откройте консоль браузера (F12)
2. Перейдите на вкладку Console
3. Введите:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```
4. Должен показаться URL вашего Supabase проекта
5. Если показывает `undefined` - переменные не загружены

## Если проблема осталась

1. **Проверьте логи приложения в Coolify:**
   - Откройте логи деплоя
   - Ищите ошибки связанные с переменными окружения

2. **Проверьте, что переменные доступны в runtime:**
   - В Next.js переменные с префиксом `NEXT_PUBLIC_` доступны в браузере
   - Переменные без этого префикса доступны только на сервере

3. **Убедитесь, что вы не перепутали ключи:**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public (можно показывать в браузере)
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role (только на сервере!)

## Частые ошибки

❌ **Неправильно:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=service_role_key_здесь  # НЕПРАВИЛЬНО!
```

✅ **Правильно:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_public_key_здесь
SUPABASE_SERVICE_ROLE_KEY=service_role_key_здесь
```

