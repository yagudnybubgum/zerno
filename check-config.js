#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка конфигурации Supabase...\n');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Файл .env.local не найден');
  console.log('   Создайте файл .env.local с переменными окружения\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

let hasErrors = false;

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_EMAILS'
];

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value === '') {
    console.log(`❌ ${varName}: не задано`);
    hasErrors = true;
  } else {
    if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
      if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        console.log(`⚠️  ${varName}: похоже на неверный URL (должен начинаться с https:// и содержать .supabase.co)`);
      } else {
        console.log(`✅ ${varName}: задано`);
      }
    } else if (varName.includes('KEY')) {
      if (value.length < 50) {
        console.log(`⚠️  ${varName}: слишком короткий ключ (возможно неверный)`);
      } else {
        console.log(`✅ ${varName}: задано`);
      }
    } else {
      console.log(`✅ ${varName}: задано`);
    }
  }
});

console.log('\n');

if (hasErrors) {
  console.log('📝 Откройте SETUP.md для инструкций по настройке\n');
  process.exit(1);
} else {
  console.log('✅ Все переменные окружения настроены!');
  console.log('   Запустите: npm run dev\n');
}



