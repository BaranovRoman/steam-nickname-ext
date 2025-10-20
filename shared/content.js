class SteamContentScript {
    constructor() {
        this.injectInjectionScript();
        this.initializeNicknameButton();
    }

    injectInjectionScript() {
        // Проверяем, не инъектирован ли уже script
        if (document.querySelector("script[data-steam-extension-injection]")) {
            return;
        }

        // Создаем script элемент
        const script = document.createElement("script");
        script.setAttribute("data-steam-extension-injection", "true");

        // Получаем URL injection script
        const injectionUrl = chrome.runtime.getURL("shared/injection.js");
        script.src = injectionUrl;

        // Добавляем script в head
        (document.head || document.documentElement).appendChild(script);
    }

    initializeNicknameButton() {
        // Ждем загрузки страницы и добавляем кнопку
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                // Добавляем небольшую задержку для динамического контента
                setTimeout(() => this.addNicknameButton(), 1000);
            });
        } else {
            // Добавляем небольшую задержку для динамического контента
            setTimeout(() => this.addNicknameButton(), 1000);
        }

        // Также пытаемся добавить кнопку через интервалы для динамического контента
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
            attempts++;

            if (!document.querySelector(".steam-extension-nickname-btn")) {
                this.addNicknameButton();
            } else {
                clearInterval(interval);
            }

            if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 2000);
    }

    addNicknameButton() {
        // Проверяем, что мы на странице профиля Steam
        if (!this.isSteamProfilePage()) {
            return;
        }

        // Проверяем, что кнопка еще не добавлена
        if (document.querySelector(".steam-extension-nickname-btn")) {
            return;
        }

        // Находим подходящее место для кнопки (рядом с именем пользователя)
        const profileNameElement = this.findProfileNameElement();
        if (!profileNameElement) {
            // Пробуем добавить кнопку в начало body как fallback
            const button = this.createNicknameButton();
            const container = document.createElement("div");
            container.className = "steam-extension-button-container";
            container.style.cssText =
                "position: fixed; top: 10px; right: 10px; z-index: 10000;";
            container.appendChild(button);
            document.body.appendChild(container);
            return;
        }

        // Создаем кнопку
        const button = this.createNicknameButton();

        // Добавляем кнопку на страницу
        this.insertButtonNearElement(profileNameElement, button);
    }

    isSteamProfilePage() {
        return (
            window.location.pathname.startsWith("/id/") ||
            window.location.pathname.startsWith("/profiles/")
        );
    }

    findProfileNameElement() {
        // Ищем различные элементы, которые могут содержать имя пользователя
        const selectors = [
            ".profile_header_bg .profile_header_bg_text .actual_persona_name",
            ".profile_header_bg_text .actual_persona_name",
            ".actual_persona_name",
            ".profile_header_bg_text h1",
            ".profile_header_bg h1",
            ".persona_name",
            ".profile_header_bg .profile_header_bg_text",
            ".profile_header_bg_text",
            ".profile_header_bg",
            ".profile_header",
            ".profile_header_content",
            ".profile_header_info",
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        document.querySelectorAll(
            '*[class*="profile"], *[class*="persona"], *[class*="header"]'
        );

        return null;
    }

    createNicknameButton() {
        const button = document.createElement("button");
        button.className = "steam-extension-nickname-btn";
        button.innerHTML = "Add nickname";
        button.title = "Добавить никнейм к профилю";

        // Добавляем обработчик клика
        button.addEventListener("click", () => {
            this.handleNicknameClick();
        });

        return button;
    }

    insertButtonNearElement(targetElement, button) {
        // Создаем контейнер для кнопки
        const container = document.createElement("div");
        container.className = "steam-extension-button-container";
        container.appendChild(button);

        // Вставляем кнопку после элемента с именем
        targetElement.parentNode.insertBefore(
            container,
            targetElement.nextSibling
        );
    }

    handleNicknameClick() {
        // Пробуем несколько способов вызова функции
        const methods = [
            // 1. Прямой вызов через injection script
            () => {
                if (window.steamExtensionShowNicknameModal) {
                    window.steamExtensionShowNicknameModal();
                    return true;
                }
                return false;
            },

            // 2. Кастомное событие
            () => {
                const event = new CustomEvent(
                    "steam-extension-show-nickname-modal",
                    {
                        detail: { source: "content-script" },
                    }
                );
                window.dispatchEvent(event);
                return true;
            },

            // 3. Прямой вызов (если доступен)
            () => {
                if (typeof window.ShowNicknameModal === "function") {
                    window.ShowNicknameModal();
                    return true;
                }
                return false;
            },
        ];

        // Пробуем каждый метод
        for (let i = 0; i < methods.length; i++) {
            try {
                if (methods[i]()) {
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Если ничего не сработало
        this.showNotification(
            "Не удалось вызвать функцию ShowNicknameModal",
            "error"
        );
    }

    showNotification(message, type = "info") {
        // Создаем уведомление
        const notification = document.createElement("div");
        notification.className = `steam-extension-notification ${type}`;
        notification.textContent = message;

        // Добавляем на страницу
        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Инициализация content script
if (typeof window !== "undefined") {
    new SteamContentScript();
}
