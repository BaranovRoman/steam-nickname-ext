// Injection script - работает в контексте страницы
(function () {
    "use strict";

    // Создаем кастомное событие для коммуникации с content script
    window.addEventListener(
        "steam-extension-show-nickname-modal",
        function (event) {
            // Проверяем, существует ли функция ShowNicknameModal
            if (typeof window.ShowNicknameModal === "function") {
                try {
                    window.ShowNicknameModal();
                } catch (error) {
                    // Игнорируем ошибки
                }
            } else {
                // Попробуем найти альтернативные способы вызова
                const alternatives = [
                    "showNicknameModal",
                    "ShowNickname",
                    "showNickname",
                    "openNicknameModal",
                    "nicknameModal",
                ];

                for (const alt of alternatives) {
                    if (typeof window[alt] === "function") {
                        try {
                            window[alt]();
                            return;
                        } catch (error) {
                            // Игнорируем ошибки
                        }
                    }
                }

                // Если ничего не найдено, показываем уведомление
                showFallbackNotification();
            }
        }
    );

    function showFallbackNotification() {
        // Создаем простое уведомление
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent =
            "Steam Extension: Функция ShowNicknameModal не найдена на этой странице";

        document.body.appendChild(notification);

        // Удаляем уведомление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Также добавляем функцию в window для прямого доступа
    window.steamExtensionShowNicknameModal = function () {
        if (typeof window.ShowNicknameModal === "function") {
            window.ShowNicknameModal();
        } else {
            showFallbackNotification();
        }
    };
})();
