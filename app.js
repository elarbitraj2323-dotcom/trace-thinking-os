// Конфигурация приложения
const APP_CONFIG = {
    STORAGE_KEY: 'trace_v0_entries',
    VERSION: '0.1.0',
    MAX_ENTRIES: 100
};

// Мок-анализатор текста
const MockAnalyzer = {
    // Генерация случайных тем
    generateThemes: (text) => {
        const themes = [
            ['Работа', 'Проекты', 'Сроки', 'Коллеги', 'Карьера'],
            ['Отношения', 'Семья', 'Друзья', 'Общение', 'Конфликт'],
            ['Здоровье', 'Сон', 'Питание', 'Спорт', 'Энергия'],
            ['Финансы', 'Бюджет', 'Инвестиции', 'Расходы', 'Сбережения'],
            ['Развитие', 'Обучение', 'Навыки', 'Цели', 'Привычки'],
            ['Творчество', 'Идеи', 'Вдохновение', 'Проекты', 'Реализация']
        ];
        
        const randomThemes = themes[Math.floor(Math.random() * themes.length)];
        return randomThemes.slice(0, 3 + Math.floor(Math.random() * 4));
    },

    // Генерация случайных эмоций
    generateEmotions: () => {
        const emotions = [
            ['😊 Радость', '😌 Спокойствие', '🙂 Удовлетворение'],
            ['🤔 Задумчивость', '😐 Нейтральность', '😶 Созерцание'],
            ['😟 Беспокойство', '😰 Тревога', '😔 Грусть'],
            ['😠 Раздражение', '😤 Нетерпение', '😑 Разочарование'],
            ['😃 Восторг', '🤩 Вдохновение', '🎯 Сфокусированность']
        ];
        return emotions[Math.floor(Math.random() * emotions.length)];
    },

    // Генерация случайного вопроса
    generateQuestion: () => {
        const questions = [
            "Что самое важное в этой ситуации для вас?",
            "Как бы вы поступили, если бы страх не был фактором?",
            "Что говорит ваша интуиция по этому поводу?",
            "Как это соотносится с вашими долгосрочными целями?",
            "Что вы можете контролировать в этой ситуации?",
            "Чему вы можете научиться из этого опыта?",
            "Что было бы идеальным исходом?"
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    },

    // Генерация рекомендации
    generateRecommendation: () => {
        const recommendations = [
            {
                type: 'do',
                text: 'Действуйте. Ситуация благоприятна, риски минимальны. Это хорошая возможность для прогресса.',
                label: 'Действовать'
            },
            {
                type: 'wait',
                text: 'Подождите. Соберите больше информации, дайте ситуации развиться. Поспешные действия могут быть неоптимальными.',
                label: 'Подождать'
            },
            {
                type: 'dont',
                text: 'Воздержитесь. Текущие условия неблагоприятны, лучше рассмотреть альтернативные варианты.',
                label: 'Не действовать'
            }
        ];
        return recommendations[Math.floor(Math.random() * recommendations.length)];
    },

    // Основной анализ текста
    analyze: (text) => {
        const words = text.trim().split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        let summary = '';
        if (words < 10) {
            summary = 'Краткая запись. Рекомендуется добавить больше деталей для глубокого анализа.';
        } else if (words < 30) {
            summary = 'Умеренное описание ситуации. Позволяет сделать базовые выводы.';
        } else {
            summary = 'Детальное описание. Хорошая основа для комплексного анализа ситуации.';
        }
        
        const themes = MockAnalyzer.generateThemes(text);
        const emotions = MockAnalyzer.generateEmotions();
        const question = MockAnalyzer.generateQuestion();
        const recommendation = MockAnalyzer.generateRecommendation();
        
        return {
            summary,
            themes,
            emotions,
            question,
            recommendation,
            meta: {
                words,
                sentences,
                analyzedAt: new Date().toISOString()
            }
        };
    }
};

// Менеджер записей
const EntryManager = {
    // Получение всех записей
    getAll: () => {
        try {
            const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Ошибка чтения записей:', error);
            return [];
        }
    },

    // Сохранение всех записей
    saveAll: (entries) => {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения записей:', error);
            return false;
        }
    },

    // Добавление новой записи
    add: (text, analysis) => {
        const entries = EntryManager.getAll();
        
        if (entries.length >= APP_CONFIG.MAX_ENTRIES) {
            entries.shift(); // Удаляем самую старую запись
        }
        
        const newEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            text: text.trim(),
            analysis: analysis
        };
        
        entries.push(newEntry);
        
        if (EntryManager.saveAll(entries)) {
            return newEntry;
        }
        return null;
    },

    // Получение записи по ID
    getById: (id) => {
        const entries = EntryManager.getAll();
        return entries.find(entry => entry.id === id);
    },

    // Удаление записи
    remove: (id) => {
        const entries = EntryManager.getAll();
        const filtered = entries.filter(entry => entry.id !== id);
        return EntryManager.saveAll(filtered);
    },

    // Экспорт в JSON
    exportToJSON: () => {
        const entries = EntryManager.getAll();
        const exportData = {
            app: 'TRACE v0',
            version: APP_CONFIG.VERSION,
            exportedAt: new Date().toISOString(),
            entries: entries
        };
        return JSON.stringify(exportData, null, 2);
    },

    // Получение статистики
    getStats: () => {
        const entries = EntryManager.getAll();
        return {
            total: entries.length,
            lastEntry: entries.length > 0 ? entries[entries.length - 1].date : null,
            storageUsed: JSON.stringify(entries).length
        };
    }
};

// UI Manager
const UIManager = {
    // Инициализация
    init: () => {
        // Обновление даты и времени
        UIManager.updateDateTime();
        setInterval(UIManager.updateDateTime, 60000);
        
        // Инициализация счетчика символов
        const textarea = document.getElementById('entryText');
        textarea.addEventListener('input', UIManager.updateCharCount);
        
        // Загрузка истории
        UIManager.loadHistory();
        UIManager.updateStorageInfo();
        
        // Назначение обработчиков событий
        UIManager.setupEventListeners();
    },

    // Обновление даты и времени
    updateDateTime: () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDateTime').textContent = 
            now.toLocaleDateString('ru-RU', options);
    },

    // Обновление счетчика символов
    updateCharCount: () => {
        const textarea = document.getElementById('entryText');
        const count = textarea.value.length;
        document.getElementById('charCount').textContent = 
            `${count} символов`;
    },

    // Загрузка истории
    loadHistory: () => {
        const entries = EntryManager.getAll();
        const historyList = document.getElementById('historyList');
        
        if (entries.length === 0) {
            historyList.innerHTML = '<div class="empty-state">📝 Записей пока нет</div>';
            return;
        }
        
        historyList.innerHTML = entries.reverse().map(entry => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const preview = entry.text.length > 100 
                ? entry.text.substring(0, 100) + '...' 
                : entry.text;
            
            const themes = entry.analysis?.themes?.slice(0, 3) || [];
            
            return `
                <div class="history-item" data-id="${entry.id}">
                    <div class="history-item-header">
                        <div class="history-item-date">${formattedDate}</div>
                        <div class="history-item-preview">${preview}</div>
                    </div>
                    ${themes.length > 0 ? `
                        <div class="history-item-themes">
                            ${themes.map(theme => `<span>${theme}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Добавление обработчиков кликов на элементы истории
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const entryId = item.dataset.id;
                UIManager.showEntry(entryId);
            });
        });
    },

    // Показать запись
    showEntry: (entryId) => {
        const entry = EntryManager.getById(entryId);
        if (!entry) return;
        
        const date = new Date(entry.date);
        document.getElementById('viewEntryDate').textContent = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('viewEntryText').textContent = entry.text;
        
        if (entry.analysis) {
            const analysisDate = new Date(entry.analysis.meta.analyzedAt);
            document.getElementById('analysisDate').textContent = 
                analysisDate.toLocaleDateString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            
            document.getElementById('viewSummary').textContent = entry.analysis.summary;
            document.getElementById('viewQuestion').textContent = entry.analysis.question;
            document.getElementById('viewRecommendationText').textContent = 
                entry.analysis.recommendation.text;
            
            const typeBadge = document.getElementById('viewRecommendationType');
            typeBadge.textContent = entry.analysis.recommendation.label;
            typeBadge.className = `recommendation-badge ${entry.analysis.recommendation.type}`;
            
            // Отображение тем
            const themesContainer = document.getElementById('viewThemes');
            themesContainer.innerHTML = entry.analysis.themes
                .map(theme => `<span>${theme}</span>`)
                .join('');
            
            // Отображение эмоций
            const emotionsContainer = document.getElementById('viewEmotions');
            emotionsContainer.innerHTML = entry.analysis.emotions
                .map(emotion => `<span>${emotion}</span>`)
                .join('');
        }
        
        UIManager.switchScreen('viewEntryScreen');
    },

    // Обновление информации о хранилище
    updateStorageInfo: () => {
        const stats = EntryManager.getStats();
        const storageInfo = document.getElementById('storageInfo');
        
        if (stats.total === 0) {
            storageInfo.textContent = 'Нет сохранённых записей';
        } else {
            const lastDate = new Date(stats.lastEntry).toLocaleDateString('ru-RU');
            storageInfo.textContent = `${stats.total} записей, последняя: ${lastDate}`;
        }
    },

    // Переключение экранов
    switchScreen: (screenId) => {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(screenId).classList.add('active');
    },

    // Показать результаты анализа
    showAnalysis: (analysis) => {
        const resultDiv = document.getElementById('analysisResult');
        
        document.getElementById('summaryText').textContent = analysis.summary;
        document.getElementById('questionText').textContent = analysis.question;
        document.getElementById('recommendationText').textContent = 
            analysis.recommendation.text;
        
        const typeBadge = document.getElementById('recommendationType');
        typeBadge.textContent = analysis.recommendation.label;
        typeBadge.className = `recommendation-badge ${analysis.recommendation.type}`;
        
        // Отображение тем
        const themesContainer = document.getElementById('themesList');
        themesContainer.innerHTML = analysis.themes
            .map(theme => `<span>${theme}</span>`)
            .join('');
        
        // Отображение эмоций
        const emotionsContainer = document.getElementById('emotionsList');
        emotionsContainer.innerHTML = analysis.emotions
            .map(emotion => `<span>${emotion}</span>`)
            .join('');
        
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    },

    // Настройка обработчиков событий
    setupEventListeners: () => {
        // Сохранение записи
        document.getElementById('saveBtn').addEventListener('click', () => {
            const text = document.getElementById('entryText').value.trim();
            
            if (!text) {
                alert('Пожалуйста, введите текст записи');
                return;
            }
            
            // Создаем мок-анализ
            const analysis = MockAnalyzer.analyze(text);
            
            // Сохраняем запись
            const saved = EntryManager.add(text, analysis);
            
            if (saved) {
                alert('Запись успешно сохранена!');
                document.getElementById('entryText').value = '';
                UIManager.updateCharCount();
                UIManager.loadHistory();
                UIManager.updateStorageInfo();
            } else {
                alert('Ошибка при сохранении записи');
            }
        });

        // Анализ текста
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            const text = document.getElementById('entryText').value.trim();
            
            if (!text) {
                alert('Пожалуйста, введите текст для анализа');
                return;
            }
            
            // Показываем индикатор загрузки
            const analyzeBtn = document.getElementById('analyzeBtn');
            const originalText = analyzeBtn.textContent;
            analyzeBtn.textContent = 'Анализируем...';
            analyzeBtn.disabled = true;
            
            // Имитация задержки анализа
            setTimeout(() => {
                const analysis = MockAnalyzer.analyze(text);
                UIManager.showAnalysis(analysis);
                
                // Восстанавливаем кнопку
                analyzeBtn.textContent = originalText;
                analyzeBtn.disabled = false;
            }, 800);
        });

        // Очистка поля
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Очистить поле ввода?')) {
                document.getElementById('entryText').value = '';
                document.getElementById('analysisResult').classList.add('hidden');
                UIManager.updateCharCount();
            }
        });

        // Переход к истории
        document.getElementById('historyBtn').addEventListener('click', () => {
            UIManager.loadHistory();
            UIManager.switchScreen('historyScreen');
        });

        // Назад из истории
        document.getElementById('backBtn').addEventListener('click', () => {
            UIManager.switchScreen('newEntryScreen');
        });

        // Назад из просмотра записи
        document.getElementById('backFromViewBtn').addEventListener('click', () => {
            UIManager.switchScreen('historyScreen');
        });

        // Экспорт JSON
        document.getElementById('exportBtn').addEventListener('click', () => {
            const jsonData = EntryManager.exportToJSON();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `trace_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Данные успешно экспортированы в JSON файл');
        });
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
    
    // Уведомление о готовности PWA
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        console.log('PWA готово к установке');
    }
});
