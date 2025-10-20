# Steam Extension

Расширение для браузера Google Chrome, предназначенное для работы с профилями Steam.

## Возможности

- 🎯 Работа только на страницах профилей Steam (`/id/` и `/profiles/`)
- 🔘 Кнопка "Добавить ник" для вызова модального окна `window.ShowNicknameModal()`
- 🔧 Использует injection script для доступа к функциям страницы
- 💾 Сохранение настроек в локальном хранилище

## Структура проекта

```
steam-ext/
├── manifest.json              # Манифест расширения
├── README.md                  # Документация
├── assets/
│   └── icons/                 # Иконки расширения
├── shared/                    # Общие скрипты
│   ├── background.js          # Background script
│   ├── content.js             # Content script
│   ├── injection.js           # Injection script (доступ к window)
│   └── content.css            # Стили для content script
└── widgets/
    └── popup/                 # Popup интерфейс
        ├── popup.html         # HTML разметка
        ├── popup.css          # Стили popup
        └── popup.js           # JavaScript логика
```

## Установка

1. Откройте Chrome и перейдите в `chrome://extensions/`
2. Включите "Режим разработчика"
3. Нажмите "Загрузить распакованное расширение"
4. Выберите папку с расширением

## Использование

1. Откройте страницу профиля Steam (steamcommunity.com/id/username или steamcommunity.com/profiles/steamid)
2. Расширение автоматически добавит кнопку "Добавить ник" рядом с именем пользователя
3. Нажмите на кнопку "Добавить ник" для вызова функции `window.ShowNicknameModal()`
4. Нажмите на иконку расширения в панели инструментов для просмотра статуса

## Разработка

### Требования

- Google Chrome (версия 88+)
- Манифест v3

### Архитектура

Расширение использует Feature Sliced Design архитектуру:

- `shared/` - общие модули (background, content scripts)
- `widgets/` - UI компоненты (popup)
- `assets/` - статические ресурсы

### Основные компоненты

1. **Background Script** (`shared/background.js`)
   - Обработка событий расширения
   - Управление хранилищем
   - Коммуникация между компонентами

2. **Content Script** (`shared/content.js`)
   - Взаимодействие с веб-страницами
   - Поиск и обработка игр на Steam
   - Модификация DOM

3. **Popup** (`widgets/popup/`)
   - Пользовательский интерфейс
   - Отображение статистики
   - Управление функциями

## API

### Сообщения

Расширение использует систему сообщений Chrome для коммуникации между компонентами:

- `scanPage` - сканирование текущей страницы
- `getGameData` - получение данных об игре
- `getStats` - получение статистики
- `saveStats` - сохранение статистики

### Хранилище

Данные сохраняются в `chrome.storage.local`:

```javascript
{
  gamesFound: number,
  gamesProcessed: number,
  lastScan: timestamp,
  settings: {
    autoScan: boolean,
    notifications: boolean,
    theme: string
  }
}
```

## Лицензия

MIT License
