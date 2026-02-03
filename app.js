// Конфигурация приложения
const APP_CONFIG = {
    STORAGE_KEY: 'trace_v0_entries',
    VERSION: '0.1.0',
    MAX_ENTRIES: 100
};

// Словари для анализа
const AnalysisRules = {
    // Категории тем и их ключевые слова
    themes: {
        'Дом / Быт': ['дом', 'быт', 'уборка', 'ремонт', 'квартира', 'комната', 'кухня', 'мебель', 'техника', 'интерьер', 'порядок', 'хаос', 'чистота', 'грязь'],
        'Животные': ['собака', 'кот', 'кошка', 'питомец', 'животное', 'зверь', 'пёс', 'котёнок', 'щенок', 'аквариум', 'птица', 'хомяк', 'кролик', 'рыбка'],
        'Радость / Позитив': ['радость', 'счастье', 'рад', 'доволен', 'ура', 'восторг', 'веселье', 'праздник', 'успех', 'победа', 'отлично', 'прекрасно', 'замечательно', 'класс'],
        'Отношения': ['друг', 'подруга', 'парень', 'девушка', 'муж', 'жена', 'семья', 'родители', 'дети', 'ребёнок', 'отношения', 'любовь', 'ссора', 'примирение', 'общение'],
        'Работа': ['работа', 'офис', 'начальник', 'коллега', 'зарплата', 'должность', 'карьера', 'увольнение', 'приём', 'совещание', 'отчёт', 'план', 'задание', 'обязанности'],
        'Проекты': ['проект', 'задача', 'дедлайн', 'срок', 'клиент', 'заказчик', 'разработка', 'внедрение', 'запуск', 'тестирование', 'планирование', 'реализация', 'итерация'],
        'Финансы': ['деньги', 'финансы', 'бюджет', 'доход', 'расход', 'зарплата', 'премия', 'кредит', 'долг', 'экономия', 'инвестиция', 'сбережения', 'покупка', 'продажа'],
        'Здоровье': ['здоровье', 'болезнь', 'лекарство', 'врач', 'больница', 'симптом', 'диета', 'спорт', 'тренировка', 'бег', 'йога', 'питание', 'витамины', 'давление'],
        'Развитие': ['развитие', 'обучение', 'курс', 'книга', 'саморазвитие', 'навык', 'знание', 'образование', 'университет', 'школа', 'экзамен', 'диплом', 'практика', 'опыт'],
        'Творчество': ['творчество', 'искусство', 'рисование', 'музыка', 'танец', 'пение', 'писательство', 'поэзия', 'вдохновение', 'креатив', 'идея', 'хобби', 'рукоделие']
    },

    // Эмоции и их ключевые слова
    emotions: {
        'Радость': ['радость', 'счастье', 'восторг', 'веселье', 'удовольствие', 'ликование', 'эйфория', 'праздник', 'ура'],
        'Спокойствие': ['спокойствие', 'умиротворение', 'гармония', 'баланс', 'расслабление', 'отдых', 'релакс', 'мир', 'тишина', 'покой'],
        'Тревога': ['тревога', 'беспокойство', 'опасение', 'страх', 'испуг', 'паника', 'нервозность', 'волнение', 'стресс'],
        'Грусть': ['грусть', 'печаль', 'тоска', 'уныние', 'разочарование', 'сожаление', 'одиночество', 'скука', 'меланхолия'],
        'Злость': ['злость', 'гнев', 'ярость', 'раздражение', 'негодование', 'возмущение', 'злоба', 'ненависть', 'обида'],
        'Вдохновение': ['вдохновение', 'энтузиазм', 'подъём', 'идея', 'творческий', 'озарение', 'поток', 'замысел', 'креатив']
    },

    // Вопросы в зависимости от тем
    questions: {
        'Дом / Быт': 'Что бы вы хотели изменить в вашем домашнем пространстве?',
        'Животные': 'Как ваш питомец влияет на ваше настроение?',
        'Радость / Позитив': 'Что именно вызвало у вас такие позитивные эмоции?',
        'Отношения': 'Как это повлияло на ваши отношения с человеком?',
        'Работа': 'Что самое важное в этой рабочей ситуации?',
        'Проекты': 'Какой следующий шаг в вашем проекте будет самым важным?',
        'Финансы': 'Как это решение повлияет на ваш бюджет в долгосрочной перспективе?',
        'Здоровье': 'Что вы можете сделать для улучшения вашего здоровья уже на этой неделе?',
        'Развитие': 'Чему конкретно вы хотите научиться в ближайшее время?',
        'Творчество': 'Что вас вдохновляет на творчество в последнее время?',
        'default': 'Что для вас самое важное в этой ситуации?'
    },

    // Рекомендации в зависимости от эмоций
    recommendations: {
        'Радость': {
            type: 'do',
            label: 'Действовать',
            text: 'Эмоциональный фон благоприятный. Вы в хорошем настроении, это подходящее время для активных действий.'
        },
        'Спокойствие': {
            type: 'wait',
            label: 'Подождать',
            text: 'Ситуация стабильна, нет срочности. Можно подождать, собрать больше информации и принять взвешенное решение.'
        },
        'Тревога': {
            type: 'dont',
            label: 'Не действовать',
            text: 'Вы испытываете тревогу. В таком состоянии решения могут быть неоптимальными. Лучше успокоиться и вернуться к вопросу позже.'
        },
        'Грусть': {
            type: 'wait',
            label: 'Подождать',
            text: 'Эмоциональное состояние снижено. Дайте себе время на восстановление сил перед принятием важных решений.'
        },
        'Злость': {
            type: 'dont',
            label: 'Не действовать',
            text: 'Сильные эмоции могут помешать объективной оценке. Отложите решение до того момента, когда эмоции улягутся.'
        },
        'Вдохновение': {
            type: 'do',
            label: 'Действовать',
            text: 'Вдохновение — отличный двигатель. Используйте этот подъём энергии для реализации замыслов.'
        },
        'default': {
            type: 'wait',
            label: 'Подождать',
            text: 'Недостаточно данных для точной рекомендации. Рекомендуется собрать больше информации.'
        }
    }
};

// Анализатор текста
const TextAnalyzer = {
    // Нормализация текста
    normalizeText: (text) => {
        return text.toLowerCase()
            .replace(/[^\wа-яё\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    },

    // Поиск ключевых слов в тексте
    findKeywords: (text, keywordLists) => {
        const normalizedText = TextAnalyzer.normalizeText(text);
        const words = normalizedText.split(' ');
        const foundKeywords = {};
        
        for (const [category, keywords] of Object.entries(keywordLists)) {
            let count = 0;
            for (const keyword of keywords) {
                if (normalizedText.includes(keyword.toLowerCase())) {
                    count++;
                }
            }
            if (count > 0) {
                foundKeywords[category] = count;
            }
        }
        
        return foundKeywords;
    },

    // Определение тем
    detectThemes: (text) => {
        const themeMatches = TextAnalyzer.findKeywords(text, AnalysisRules.themes);
        const themes = Object.keys(themeMatches);
        
        if (themes.length === 0) {
            return ['Недостаточно данных'];
        }
        
        // Сортируем темы по количеству совпадений
        return themes.sort((a, b) => themeMatches[b] - themeMatches[a]);
    },

    // Определение эмоций
    detectEmotions: (text) => {
        const emotionMatches = TextAnalyzer.findKeywords(text, AnalysisRules.emotions);
        const emotions = Object.keys(emotionMatches);
        
        if (emotions.length === 0) {
            return ['Не определено'];
        }
        
        // Сортируем эмоции по количеству совпадений
        return emotions.sort((a, b) => emotionMatches[b] - emotionMatches[a]);
    },

    // Генерация уточняющего вопроса
    generateQuestion: (themes) => {
        if (themes[0] === 'Недостаточно данных') {
            return AnalysisRules.questions.default;
        }
        
        for (const theme of themes) {
            if (AnalysisRules.questions[theme]) {
                return AnalysisRules.questions[theme];
            }
        }
        
        return AnalysisRules.questions.default;
    },

    // Генерация рекомендации
    generateRecommendation: (emotions) => {
        if (emotions[0] === 'Не определено') {
            return AnalysisRules.recommendations.default;
        }
        
        for (const emotion of emotions) {
            if (AnalysisRules.recommendations[emotion]) {
                return AnalysisRules.recommendations[emotion];
            }
        }
        
        return AnalysisRules.recommendations.default;
    },

    // Генерация краткого резюме
    generateSummary: (text, themes, emotions) => {
        const wordCount = text.trim().split(/\s+/).length;
        
        if (themes[0] === 'Недостаточно данных') {
            return 'Текст слишком короткий для содержательного анализа. Попробуйте описать ситуацию более подробно.';
        }
        
        const mainTheme = themes[0];
        const mainEmotion = emotions[0];
        
        let summary = `Вы написали о ${mainTheme.toLowerCase()}. `;
        
        if (wordCount < 20) {
            summary += 'Описание довольно краткое, но уже позволяет сделать некоторые выводы. ';
        } else if (wordCount < 50) {
            summary += 'Текст содержит достаточное количество деталей для анализа. ';
        } else {
            summary += 'Детальное описание позволяет провести комплексный анализ ситуации. ';
        }
        
        if (mainEmotion !== 'Не определено') {
            summary += `Основной эмоциональный фон: ${mainEmotion.toLowerCase()}.`;
        }
        
        return summary;
    },

    // Основной анализ
    analyze: (text) => {
        const trimmedText = text.trim();
        
        if (!trimmedText) {
            return {
                summary: 'Введите текст для анализа',
                themes: ['Ожидание ввода'],
                emotions: ['Ожидание ввода'],
                question: 'Что вы хотите проанализировать?',
                recommendation: {
                    type: 'wait',
                    label: 'Ожидание',
                    text: 'Введите текст для получения рекомендации'
                },
                meta: {
                    words: 0,
                    sentences: 0,
                    analyzedAt: new Date().toISOString()
                }
            };
        }
        
        const themes = TextAnalyzer.detectThemes(trimmedText);
        const emotions = TextAnalyzer.detectEmotions(trimmedText);
        const question = TextAnalyzer.generateQuestion(themes);
        const recommendation = TextAnalyzer.generateRecommendation(emotions);
        const summary = TextAnalyzer.generateSummary(trimmedText, themes, emotions);
        
        // Подсчёт статистики
        const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const words = trimmedText.split(/\s+/).filter(w => w.length > 0).length;
        
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
    getAll: () => {
        try {
            const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Ошибка чтения записей:', error);
            return [];
        }
    },

    saveAll: (entries) => {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения записей:', error);
            return false;
        }
    },

    add: (text, analysis) => {
        const entries = EntryManager.getAll();
        
        if (entries.length >= APP_CONFIG.MAX_ENTRIES) {
            entries.shift();
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

    getById: (id) => {
        const entries = EntryManager.getAll();
        return entries.find(entry => entry.id === id);
    },

    remove: (id) => {
        const entries = EntryManager.getAll();
        const filtered = entries.filter(entry => entry.id !== id);
        return EntryManager.saveAll(filtered);
    },

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
    init: () => {
        UIManager.updateDateTime();
        setInterval(UIManager.updateDateTime, 60000);
        
        const textarea = document.getElementById('entryText');
        textarea.addEventListener('input', UIManager.updateCharCount);
        
        UIManager.loadHistory();
        UIManager.updateStorageInfo();
        UIManager.setupEventListeners();
    },

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

    updateCharCount: () => {
        const textarea = document.getElementById('entryText');
        const count = textarea.value.length;
        document.getElementById('charCount').textContent = 
            `${count} символов`;
    },

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
                    ${themes.length > 0 && themes[0] !== 'Недостаточно данных' ? `
                        <div class="history-item-themes">
                            ${themes.map(theme => `<span>${theme}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const entryId = item.dataset.id;
                UIManager.showEntry(entryId);
            });
        });
    },

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
            
            const themesContainer = document.getElementById('viewThemes');
            themesContainer.innerHTML = entry.analysis.themes
                .map(theme => `<span>${theme}</span>`)
                .join('');
            
            const emotionsContainer = document.getElementById('viewEmotions');
            emotionsContainer.innerHTML = entry.analysis.emotions
                .map(emotion => `<span>${emotion}</span>`)
                .join('');
        }
        
        UIManager.switchScreen('viewEntryScreen');
    },

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

    switchScreen: (screenId) => {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(screenId).classList.add('active');
    },

    showAnalysis: (analysis) => {
        const resultDiv = document.getElementById('analysisResult');
        
        document.getElementById('summaryText').textContent = analysis.summary;
        document.getElementById('questionText').textContent = analysis.question;
        document.getElementById('recommendationText').textContent = 
            analysis.recommendation.text;
        
        const typeBadge = document.getElementById('recommendationType');
        typeBadge.textContent = analysis.recommendation.label;
        typeBadge.className = `recommendation-badge ${analysis.recommendation.type}`;
        
        const themesContainer = document.getElementById('themesList');
        themesContainer.innerHTML = analysis.themes
            .map(theme => `<span>${theme}</span>`)
            .join('');
        
        const emotionsContainer = document.getElementById('emotionsList');
        emotionsContainer.innerHTML = analysis.emotions
            .map(emotion => `<span>${emotion}</span>`)
            .join('');
        
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    },

    setupEventListeners: () => {
        document.getElementById('saveBtn').addEventListener('click', () => {
            const text = document.getElementById('entryText').value.trim();
            
            if (!text) {
                alert('Пожалуйста, введите текст записи');
                return;
            }
            
            const analysis = TextAnalyzer.analyze(text);
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

        document.getElementById('analyzeBtn').addEventListener('click', () => {
            const text = document.getElementById('entryText').value.trim();
            
            if (!text) {
                alert('Пожалуйста, введите текст для анализа');
                return;
            }
            
            const analyzeBtn = document.getElementById('analyzeBtn');
            const originalText = analyzeBtn.textContent;
            analyzeBtn.textContent = 'Анализируем...';
            analyzeBtn.disabled = true;
            
            setTimeout(() => {
                const analysis = TextAnalyzer.analyze(text);
                UIManager.showAnalysis(analysis);
                
                analyzeBtn.textContent = originalText;
                analyzeBtn.disabled = false;
            }, 800);
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Очистить поле ввода?')) {
                document.getElementById('entryText').value = '';
                document.getElementById('analysisResult').classList.add('hidden');
                UIManager.updateCharCount();
            }
        });

        document.getElementById('historyBtn').addEventListener('click', () => {
            UIManager.loadHistory();
            UIManager.switchScreen('historyScreen');
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            UIManager.switchScreen('newEntryScreen');
        });

        document.getElementById('backFromViewBtn').addEventListener('click', () => {
            UIManager.switchScreen('historyScreen');
        });

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
    
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        console.log('PWA готово к установке');
    }
});
