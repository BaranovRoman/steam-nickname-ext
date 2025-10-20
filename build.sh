#!/bin/bash

# Скрипт для создания архива расширения для Chrome Web Store

echo "🔨 Создание архива для Chrome Web Store..."

# Удаляем старый архив если есть
if [ -f "steam-extension-release.zip" ]; then
    rm steam-extension-release.zip
    echo "🗑️  Удален старый архив"
fi

# Создаем новый архив, исключая ненужные файлы
zip -r steam-extension-release.zip . \
    -x "*.git*" \
    -x "*.DS_Store" \
    -x "node_modules/*" \
    -x "PINNED_CONVERSATION.md" \
    -x "build.sh" \
    -x "DEPLOYMENT.md" \
    -x "assets/icons/README.md"

echo "✅ Архив создан: steam-extension-release.zip"
echo "📁 Размер архива: $(du -h steam-extension-release.zip | cut -f1)"
echo ""
echo "🚀 Готово для загрузки в Chrome Web Store!"
echo ""
echo "⚠️  НЕ ЗАБУДЬТЕ:"
echo "   1. Создать PNG иконки всех размеров"
echo "   2. Протестировать расширение"
echo "   3. Подготовить скриншоты"
echo "   4. Написать описание для магазина"
