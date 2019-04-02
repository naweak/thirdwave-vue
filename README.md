# thirdwave-vue

> Фронтенд https://github.com/www-upyachka/site-api/

## Требования

## Установка

1. Установить Node.js и npm

2. Установить зависимости и собрать

```bash
# Установка зависимостей
npm install

# Сервер для разработки (доступен на localhost:8080 (или 8081, если порт занят))
npm run serve

# Сборка для продакшена
npm run build
```

3. Скопировать `src/config.example.js` в `src/config.js` и отредактировать под свои нужды

4. Расположить `/dist` в корне своего веб-сервера и [настроить так, чтобы vue-router работал корректно](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)
