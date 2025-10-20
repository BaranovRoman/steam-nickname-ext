class PopupController {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateStatus();
    }

    initializeElements() {
        this.statusIndicator = document.getElementById("statusIndicator");
        this.statusText = document.getElementById("statusText");
    }

    bindEvents() {
        // Нет кнопок для привязки событий
    }

    async updateStatus() {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });

            if (this.isSteamPage(tab.url)) {
                this.setStatus("active", "Активен на профиле Steam");
            } else {
                this.setStatus("inactive", "Откройте профиль Steam");
            }
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
            this.setStatus("error", "Ошибка");
        }
    }

    setStatus(status, text) {
        const statusDot = this.statusIndicator.querySelector(".status-dot");

        statusDot.className = "status-dot";
        if (status === "active") {
            statusDot.classList.add("active");
        }

        this.statusText.textContent = text;
    }

    isSteamPage(url) {
        return (
            url &&
            (url.includes("steamcommunity.com/id/") ||
                url.includes("steamcommunity.com/profiles/"))
        );
    }
}

// Инициализация при загрузке popup
document.addEventListener("DOMContentLoaded", () => {
    new PopupController();
});
