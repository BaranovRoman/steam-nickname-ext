class BackgroundService {
    constructor() {
        this.initializeEventListeners();
        this.initializeStorage();
    }

    initializeEventListeners() {
        // Обработчик установки расширения
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstall(details);
        });

        // Обработчик обновления расширения
        chrome.runtime.onStartup.addListener(() => {
            this.handleStartup();
        });

        // Обработчик сообщений от content scripts и popup
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                this.handleMessage(request, sender, sendResponse);
                return true; // Указываем, что ответ будет асинхронным
            }
        );

        // Обработчик изменения вкладок
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        // Обработчик активации вкладки
        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.handleTabActivated(activeInfo);
        });
    }

    async initializeStorage() {
        // Инициализируем хранилище с дефолтными значениями
        const defaultData = {
            settings: {
                notifications: true,
                theme: "light",
            },
        };

        try {
            const existingData = await chrome.storage.local.get();
            const mergedData = { ...defaultData, ...existingData };
            await chrome.storage.local.set(mergedData);
        } catch (error) {}
    }

    handleInstall(details) {
        if (details.reason === "install") {
            // Первая установка
            this.showWelcomeNotification();
        } else if (details.reason === "update") {
            // Обновление
            this.showUpdateNotification(details.previousVersion);
        }
    }

    handleStartup() {
        // Можно добавить логику инициализации при запуске браузера
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case "getSettings":
                    const settings = await this.getSettings();
                    sendResponse({ success: true, data: settings });
                    break;

                case "saveSettings":
                    await this.saveSettings(request.data);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({
                        success: false,
                        error: "Неизвестное действие",
                    });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    handleTabUpdate(tabId, changeInfo, tab) {
        // Отслеживаем изменения вкладок Steam
        if (changeInfo.status === "complete" && this.isSteamPage(tab.url)) {
            this.onSteamPageLoaded(tabId, tab);
        }
    }

    handleTabActivated(activeInfo) {
        // Обрабатываем активацию вкладки
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (this.isSteamPage(tab.url)) {
                this.onSteamPageActivated(tab);
            }
        });
    }

    isSteamPage(url) {
        return (
            url &&
            (url.includes("steamcommunity.com/id/") ||
                url.includes("steamcommunity.com/profiles/"))
        );
    }

    async onSteamPageLoaded(tabId, tab) {}

    onSteamPageActivated(tab) {}

    async getSettings() {
        try {
            const result = await chrome.storage.local.get("settings");
            return (
                result.settings || {
                    notifications: true,
                    theme: "light",
                }
            );
        } catch (error) {
            return { notifications: true, theme: "light" };
        }
    }

    async saveSettings(settings) {
        try {
            await chrome.storage.local.set({ settings });
        } catch (error) {}
    }

    showWelcomeNotification() {
        if (chrome.notifications) {
            chrome.notifications.create({
                type: "basic",
                title: "Steam Extension установлено!",
                message:
                    "Расширение готово к работе. Откройте страницу профиля Steam для начала работы.",
            });
        }
    }

    showUpdateNotification(previousVersion) {
        if (chrome.notifications) {
            chrome.notifications.create({
                type: "basic",
                title: "Steam Extension обновлено!",
                message: `Обновлено с версии ${previousVersion} до 1.0.0`,
            });
        }
    }
}

// Инициализация background service
new BackgroundService();
