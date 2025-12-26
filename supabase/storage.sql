-- Storage policies for lot-images bucket
-- Выполните этот SQL после создания bucket 'lot-images' в Storage

-- Политика для публичного чтения (если bucket не публичный)
CREATE POLICY "Public Access for lot-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lot-images');

-- Политика для загрузки файлов (только для авторизованных пользователей)
-- В продакшене используйте service role для загрузки через приложение
CREATE POLICY "Authenticated users can upload to lot-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lot-images' 
  AND auth.role() = 'authenticated'
);

-- Политика для обновления файлов
CREATE POLICY "Authenticated users can update lot-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lot-images' 
  AND auth.role() = 'authenticated'
);

-- Политика для удаления файлов
CREATE POLICY "Authenticated users can delete lot-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lot-images' 
  AND auth.role() = 'authenticated'
);

