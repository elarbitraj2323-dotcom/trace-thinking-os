// Конфигурация приложения
const APP_CONFIG = {
    STORAGE_KEY: 'trace_v0_entries',
    USER_DICT_KEY: 'trace_v0_user_dict',
    VERSION: '0.2.0',
    MAX_ENTRIES: 100,
    MIN_TEXT_LENGTH: 10
};

// Базовые словари для анализа
const AnalysisRules = {
    themes: {
        'Дом / Быт': ['дом', 'быт', 'уборка', 'ремонт', 'квартира', 'комната', 'кухня', 'мебель', 'техника'],
        'Животные': ['собака', 'щенок', 'пёс', 'кот', 'кошка', 'питомец', 'животное', 'зверь', 'котёнок', 'аквариум', 'птица', 'хомяк'],
        'Радость / Позитив': ['радость', 'счастье', 'рад', 'доволен', 'ура', 'восторг', 'веселье', 'праздник', 'успех', 'победа'],
        'Отношения': ['друг', 'подруга', 'парень', 'девушка', 'муж', 'жена', 'семья', 'родители', 'дети', 'ребёнок', 'любовь', 'ссора'],
        'Работа': ['работа', 'офис', 'начальник', 'коллега', 'зарплата', 'должность', 'карьера', 'увольнение', 'совещание', 'отчёт'],
        'Проекты': ['проект', 'задача', 'дедлайн', 'срок', 'клиент', 'разработка', 'внедрение', 'запуск', 'тестирование', 'планирование'],
        'Финансы': ['деньги', 'финансы', 'бюджет', 'доход', 'расход', 'премия', 'кредит', 'долг', 'экономия', 'инвестиция', 'покупка'],
        'Здоровье': ['здоровье', 'болезнь', 'лекарство', 'врач', 'больница', 'диета', 'спорт', 'тренировка', 'питание', 'витамины'],
        'Развитие': ['развитие', 'обучение', 'курс', 'книга', 'саморазвитие', 'навык', 'образование', 'университет', 'экзамен'],
        'Творчество': ['творчество', 'искусство', 'рисование', 'музыка', 'танец', 'пение', 'писательство', 'поэзия', 'вдохновение', 'хобби']
    },

    emotions: {
        'Радость': ['радость', 'счастье', 'восторг', 'веселье', 'удовольствие', 'ликование', 'праздник', 'ура', 'рад', 'доволен'],
        'Грусть': ['грусть', 'печаль', 'тоска', 'уныние', 'разочарование', 'сожаление', 'одиночество', 'скука', 'плакать', 'слёзы'],
        'Тревога': ['тревога', 'беспокойство', 'опасение', 'страх', 'испуг', 'паника', 'нервозность', 'волнение', 'стресс', 'боюсь'],
        'Злость': ['злость', 'гнев', 'ярость', 'раздражение', 'негодование', 'возмущение', 'злоба', 'ненависть', 'обида', 'сердит'],
        'Усталость': ['усталость', 'устал', 'устала', 'изнеможение', 'истощение', 'сонливость', 'вялость', 'нет сил', 'утомление'],
        'Спокойствие': ['спокойствие', 'умиротворение', 'гармония', 'баланс', 'расслабление', 'отдых', 'релакс', 'мир', 'тишина', 'покой'],
        'Вдохновение': ['вдохновение', 'энтузиазм', 'подъём', 'идея', 'творческий', 'озарение', 'поток', 'замысел', 'креатив', 'вдохновлён']
    },

    questions: {
        'Дом / Быт': 'Что бы вы хотели изменить в вашем домашнем пространстве?',
        'Животные': 'Как ваш питомец влияет на ваше настроение?',
        'Радость / Позитив': 'Что именно вызвало у вас такие позитивные эмоции?',
        'Отношения': 'Как это повлияло на ваши отношения с человеком?',
        'Работа': 'Что самое важное в этой рабочей ситуации?',
        'Проекты': 'Какой следующий шаг будет самым важным в вашем проекте?',
        'Финансы': 'Как это решение повлияет на ваш бюджет в долгосрочной перспективе?',
        'Здоровье': 'Что вы можете сделать для улучшения здоровья уже на этой неделе?',
        'Развитие': 'Чему конкретно вы хотите научиться в ближайшее время?',
        'Творчество': 'Что вас вдохновляет на творчество в последнее время?',
        'Другое': 'Расскажите подробнее, что происходит?',
        'default': 'Что для вас самое важное в этой ситуации?'
    },

    recommendations: {
        'Радость': {
            type: 'do',
            label: 'Действовать',
            text: 'Эмоциональный фон благоприятный. Вы в хорошем настроении, это подходящее время для активных действий.'
        },
        'Грусть': {
            type: 'wait',
            label: 'Подождать',
            text: 'Эмоциональное состояние снижено. Дайте себе время на восстановление сил перед принятием важных решений.'
        },
        'Тревога': {
            type: 'dont',
            label: 'Не действовать',
            text: 'Вы испытываете тревогу. В таком состоянии решения могут быть неоптимальными. Лучше успокоиться и вернуться к вопросу позже.'
        },
        'Злость': {
            type: 'dont',
            label: 'Не действовать',
            text: 'Сильные эмоции могут помешать объективной оценке. Отложите решение до того момента, когда эмоции улягутся.'
        },
        'Усталость': {
            type: 'wait',
            label: 'Подождать',
            text: 'Организму нужен отдых. Примите решение после восстановления сил.'
        },
        'Спокойствие': {
            type: 'wait',
            label: 'Подождать',
            text: 'Ситуация стабильна. Можно подождать, собрать больше информации и принять взвешенное решение.'
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

// Менеджер пользовательского словаря
const UserDictionary = {
    get: () => {
        try {
            const data = localStorage.getItem(APP_CONFIG.USER_DICT_KEY);
            return data ? JSON.parse(data) : { themes: {}, emotions: {} };
        } catch (error) {
            console.error('Ошибка чтения пользовательского словаря:', error);
            return { themes: {}, emotions: {} };
        }
    },

    save: (dict) => {
        try {
            localStorage.setItem(APP_CONFIG.USER_DICT_KEY, JSON.stringify(dict));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения пользовательского словаря:', error);
            return false;
        }
    },

    addThemeWord: (theme, word) => {
        const dict = UserDictionary.get();
        if (!dict.themes[theme]) {
            dict.themes[theme] = [];
        }
        if (!dict.themes[theme].includes(word)) {
            dict.themes[theme].push(word);
            return UserDictionary.save(dict);
        }
        return true;
    },

    addEmotionWord: (emotion, word) => {
        const dict = UserDictionary.get();
        if (!dict.emotions[emotion]) {
            dict.emotions[emotion] = [];
        }
        if (!dict.emotions[emotion].includes(word)) {
            dict.emotions[emotion].push(word);
            return UserDictionary.save(dict);
        }
        return true;
    },

    getCombinedThemes: () => {
        const base = AnalysisRules.themes;
        const user = UserDictionary.get().themes;
        const combined = { ...base };
        
        for (const [theme, words] of Object.entries(user)) {
            if (!combined[theme]) {
                combined[theme] = [];
            }
            combined[theme] = [...new Set([...combined[theme], ...words])];
        }
        
        return combined;
    },

    getCombinedEmotions: () => {
        const base = AnalysisRules.emotions;
        const user = UserDictionary.get().emotions;
        const combined = { ...base };
        
        for (const [emotion, words] of Object.entries(user)) {
            if (!combined[emotion]) {
                combined[emotion] = [];
            }
            combined[emotion] = [...new Set([...combined[emotion], ...words])];
        }
        
        return combined;
    }
};

// Анализатор текста
const TextAnalyzer = {
    normalizeText: (text) => {
        return text.toLowerCase()
            .replace(/[ё]/g, 'е')
            .replace(/[^\wа-я\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    },

    extractKeywords: (text) => {
        const normalized = TextAnalyzer.normalizeText(text);
        return normalized.split(' ')
            .filter(word => word.length > 2 && !['это', 'что', 'как', 'для', 'меня', 'очень', 'мне', 'был', 'была'].includes(word));
    },

    findMatches: (keywords, dictionary) => {
        const matches = {};
        
        for (const [category, words] of Object.entries(dictionary)) {
            let count = 0;
            for (const keyword of keywords) {
                for (const dictWord of words) {
                    if (keyword.includes(dictWord) || dictWord.includes(keyword)) {
                        count++;
                        break;
                    }
                }
            }
            if (count > 0) {
                matches[category] = count;
            }
        }
        
        return matches;
    },

    detectThemes: (text) => {
        if (text.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            return ['Текст слишком короткий'];
        }
        
        const keywords = TextAnalyzer.extractKeywords(text);
        if (keywords.length === 0) {
            return ['Недостаточно данных / Другое'];
        }
        
        const combinedThemes = UserDictionary.getCombinedThemes();
        const matches = TextAnalyzer.findMatches(keywords, combinedThemes);
        
        if (Object.keys(matches).length === 0) {
            return ['Недостаточно данных / Другое'];
        }
        
        const sorted = Object.entries(matches)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        const confidence = matches[sorted[0]] / keywords.length;
        return confidence > 0.1 ? sorted.slice(0, 3) : ['Недостаточно данных / Другое'];
    },

    detectEmotions: (text) => {
        if (text.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            return ['Текст слишком короткий'];
        }
        
        const keywords = TextAnalyzer.extractKeywords(text);
        if (keywords.length === 0) {
            return ['Не определено'];
        }
        
        const combinedEmotions = UserDictionary.getCombinedEmotions();
        const matches = TextAnalyzer.findMatches(keywords, combinedEmotions);
        
        if (Object.keys(matches).length === 0) {
            return ['Не определено'];
        }
        
        const sorted = Object.entries(matches)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        const confidence = matches[sorted[0]] / keywords.length;
        return confidence > 0.15 ? sorted.slice(0, 2) : ['Не определено'];
    },

    generateQuestion: (themes) => {
        if (themes[0] === 'Текст слишком короткий' || themes[0] === 'Недостаточно данных / Другое') {
            return AnalysisRules.questions['Другое'];
        }
        
        for (const theme of themes) {
            if (AnalysisRules.questions[theme]) {
                return AnalysisRules.questions[theme];
            }
        }
        
        return AnalysisRules.questions.default;
    },

    generateRecommendation: (emotions) => {
        if (emotions[0] === 'Текст слишком короткий' || emotions[0] === 'Не определено') {
            return AnalysisRules.recommendations.default;
        }
        
        for (const emotion of emotions) {
            if (AnalysisRules.recommendations[emotion]) {
                return AnalysisRules.recommendations[emotion];
            }
        }
        
        return AnalysisRules.recommendations.default;
    },

    generateSummary: (text, themes, emotions) => {
        if (text.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            return 'Текст слишком короткий для анализа. Напишите хотя бы 10 символов.';
        }
        
        if (themes[0] === 'Недостаточно данных / Другое') {
            return 'Текст не содержит достаточного количества ключевых слов для определения тем. Попробуйте описать подробнее.';
        }
        
        const mainTheme = themes[0];
        const mainEmotion = emotions[0];
        
        let summary = `Основная тема: ${mainTheme}. `;
        
        if (mainEmotion !== 'Не определено' && mainEmotion !== 'Текст слишком короткий') {
            summary += `Преобладающая эмоция: ${mainEmotion.toLowerCase()}. `;
        }
        
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount < 20) {
            summary += 'Описание краткое, но уже позволяет сделать некоторые выводы.';
        } else if (wordCount < 50) {
            summary += 'Текст содержит достаточно деталей для анализа.';
        } else {
            summary += 'Подробное описание позволяет провести глубокий анализ.';
        }
        
        return summary;
    },

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
        const userDict = UserDictionary.get();
        const exportData = {
            app: 'TRACE v0',
            version: APP_CONFIG.VERSION,
            exportedAt: new Date().toISOString(),
            entries: entries,
            userDictionary: userDict
        };
        return JSON.stringify(exportData, null, 2);
    },

    importFromJSON: (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.entries && Array.isArray(data.entries)) {
                EntryManager.saveAll(data.entries);
            }
            if (data.userDictionary) {
                localStorage.setItem(APP_CONFIG.USER_DICT_KEY, JSON.stringify(data.userDictionary));
            }
            return true;
        } catch (error) {
            console.error('Ошибка импорта:', error);
            return false;
        }
    },

    getStats: () => {
        const entries = EntryManager.getAll();
        const userDict = UserDictionary.get();
        return {
            totalEntries: entries.length,
            totalThemes: Object.keys(userDict.themes || {}).length,
            totalEmotions: Object.keys(userDict.emotions || {}).length,
            lastEntry: entries.length > 0 ? entries[entries.length - 1].date : null
        };
    }
};

// Toast-уведомления
const ToastManager = {
    show: (message, type = 'info', duration = 3000) => {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Удаляем toast после анимации
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        container.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);
    }
};

// UI Manager
const UIManager = {
    currentAnalysis: null,
    currentText: '',
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    init: () => {
        // Обновление даты и времени
        UIManager.updateDateTime();
        setInterval(UIManager.updateDateTime, 60000);
        
        // Инициализация элементов
        const textarea = document.getElementById('entryText');
        if (textarea) {
            textarea.addEventListener('input', UIManager.handleTextareaInput);
            textarea.addEventListener('focus', () => {
                textarea.parentElement.classList.add('focused');
            });
            textarea.addEventListener('blur', () => {
                textarea.parentElement.classList.remove('focused');
            });
        }
        
        // Загрузка данных
        UIManager.loadHistory();
        UIManager.updateStorageInfo();
        
        // Настройка обработчиков
        UIManager.setupEventListeners();
        UIManager.setupCorrectionListeners();
        
        // Настройка анимаций для пользователей с prefers-reduced-motion
        if (UIManager.isReducedMotion) {
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
        
        // Инициализация живого фона
        UIManager.initAmbientBackground();
    },

    initAmbientBackground: () => {
        if (UIManager.isReducedMotion) return;
        
        const bg = document.getElementById('ambientBg');
        if (!bg) return;
        
        // Плавное изменение градиента
        let time = 0;
        const updateBackground = () => {
            if (!UIManager.isReducedMotion) {
                time += 0.001;
                const x = Math.sin(time) * 10;
                const y = Math.cos(time * 0.7) * 10;
                const scale = 1 + Math.sin(time * 0.5) * 0.02;
                
                bg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            }
            requestAnimationFrame(updateBackground);
        };
        
        // Запускаем только если не включен prefers-reduced-motion
        if (!UIManager.isReducedMotion) {
            requestAnimationFrame(updateBackground);
        }
    },

    updateDateTime: () => {
        const now = new Date();
        const dateTimeStr = now.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const dateTimeElement = document.getElementById('currentDateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = dateTimeStr;
        }
    },

    handleTextareaInput: (e) => {
        const textarea = e.target;
        const count = textarea.value.length;
        const charCountElement = document.getElementById('charCount');
        
        if (charCountElement) {
            charCountElement.textContent = `${count} символов`;
            
            // Динамическое изменение высоты textarea
            textarea.style.height = 'auto';
            const newHeight = Math.min(Math.max(textarea.scrollHeight, 160), 400);
            textarea.style.height = `${newHeight}px`;
        }
    },

    loadHistory: () => {
        const entries = EntryManager.getAll();
        const historyList = document.getElementById('historyList');
        
        if (!historyList) return;
        
        if (entries.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3 class="empty-state-title">Записей пока нет</h3>
                    <p class="empty-state-text">Начните с новой записи</p>
                </div>
            `;
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
                    ${themes.length > 0 && themes[0] !== 'Текст слишком короткий' && themes[0] !== 'Недостаточно данных / Другое' ? `
                        <div class="history-item-themes">
                            ${themes.map(theme => `<span>${theme}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Добавляем обработчики кликов
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const entryId = item.dataset.id;
                    UIManager.showEntry(entryId);
                }
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
        
        if (storageInfo) {
            if (stats.totalEntries === 0) {
                storageInfo.textContent = 'Нет сохранённых записей';
            } else {
                storageInfo.textContent = `${stats.totalEntries} записей · ${stats.totalThemes} тем · ${stats.totalEmotions} эмоций`;
            }
        }
    },

    switchScreen: (screenId) => {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Прокрутка наверх при смене экрана
        window.scrollTo({ top: 0, behavior: UIManager.isReducedMotion ? 'auto' : 'smooth' });
    },

    showAnalysis: (analysis, text) => {
        UIManager.currentAnalysis = analysis;
        UIManager.currentText = text;
        
        const resultDiv = document.getElementById('analysisResult');
        if (!resultDiv) return;
        
        // Обновляем время анализа
        const analysisTime = document.getElementById('analysisTime');
        if (analysisTime) {
            const now = new Date();
            analysisTime.textContent = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Обновляем контент
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
        
        // Показываем блок анализа
        resultDiv.classList.remove('hidden');
        
        // Плавная прокрутка к результатам
        if (!UIManager.isReducedMotion) {
            setTimeout(() => {
                resultDiv.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    },

    setupCorrectionListeners: () => {
        const fixThemeBtn = document.getElementById('fixThemeBtn');
        const fixEmotionBtn = document.getElementById('fixEmotionBtn');
        const saveThemeBtn = document.getElementById('saveThemeCorrection');
        const saveEmotionBtn = document.getElementById('saveEmotionCorrection');
        
        if (fixThemeBtn) {
            fixThemeBtn.addEventListener('click', () => {
                document.getElementById('themeCorrection').classList.remove('hidden');
                document.getElementById('emotionCorrection').classList.add('hidden');
            });
        }
        
        if (fixEmotionBtn) {
            fixEmotionBtn.addEventListener('click', () => {
                document.getElementById('emotionCorrection').classList.remove('hidden');
                document.getElementById('themeCorrection').classList.add('hidden');
            });
        }
        
        if (saveThemeBtn) {
            saveThemeBtn.addEventListener('click', () => {
                const selectedTheme = document.getElementById('themeSelect').value;
                if (!selectedTheme) {
                    ToastManager.show('Выберите тему для исправления', 'error');
                    return;
                }
                
                const keywords = TextAnalyzer.extractKeywords(UIManager.currentText);
                keywords.forEach(word => {
                    UserDictionary.addThemeWord(selectedTheme, word);
                });
                
                ToastManager.show(`Тема исправлена на "${selectedTheme}"`, 'success');
                document.getElementById('themeCorrection').classList.add('hidden');
                
                const newAnalysis = TextAnalyzer.analyze(UIManager.currentText);
                UIManager.showAnalysis(newAnalysis, UIManager.currentText);
            });
        }
        
        if (saveEmotionBtn) {
            saveEmotionBtn.addEventListener('click', () => {
                const selectedEmotion = document.getElementById('emotionSelect').value;
                if (!selectedEmotion) {
                    ToastManager.show('Выберите эмоцию для исправления', 'error');
                    return;
                }
                
                const keywords = TextAnalyzer.extractKeywords(UIManager.currentText);
                keywords.forEach(word => {
                    UserDictionary.addEmotionWord(selectedEmotion, word);
                });
                
                ToastManager.show(`Эмоция исправлена на "${selectedEmotion}"`, 'success');
                document.getElementById('emotionCorrection').classList.add('hidden');
                
                const newAnalysis = TextAnalyzer.analyze(UIManager.currentText);
                UIManager.showAnalysis(newAnalysis, UIManager.currentText);
            });
        }
    },

    setupEventListeners: () => {
        // Сохранение записи
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const text = document.getElementById('entryText').value.trim();
                
                if (!text) {
                    ToastManager.show('Введите текст записи', 'error');
                    return;
                }
                
                if (text.length < APP_CONFIG.MIN_TEXT_LENGTH) {
                    ToastManager.show(`Минимальная длина записи: ${APP_CONFIG.MIN_TEXT_LENGTH} символов`, 'error');
                    return;
                }
                
                const analysis = TextAnalyzer.analyze(text);
                const saved = EntryManager.add(text, analysis);
                
                if (saved) {
                    ToastManager.show('Запись сохранена', 'success');
                    document.getElementById('entryText').value = '';
                    document.getElementById('analysisResult').classList.add('hidden');
                    
                    // Сброс высоты textarea
                    const textarea = document.getElementById('entryText');
                    textarea.style.height = '160px';
                    
                    UIManager.updateCharCount();
                    UIManager.loadHistory();
                    UIManager.updateStorageInfo();
                } else {
                    ToastManager.show('Ошибка при сохранении', 'error');
                }
            });
        }

        // Анализ текста
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                const text = document.getElementById('entryText').value.trim();
                
                if (!text) {
                    ToastManager.show('Введите текст для анализа', 'error');
                    return;
                }
                
                if (text.length < APP_CONFIG.MIN_TEXT_LENGTH) {
                    ToastManager.show(`Минимальная длина для анализа: ${APP_CONFIG.MIN_TEXT_LENGTH} символов`, 'error');
                    return;
                }
                
                // Показываем состояние загрузки
                const originalText = analyzeBtn.innerHTML;
                analyzeBtn.innerHTML = `
                    <span class="loading"></span>
                    Анализируем...
                `;
                analyzeBtn.disabled = true;
                
                // Имитация задержки для UX
                setTimeout(() => {
                    const analysis = TextAnalyzer.analyze(text);
                    UIManager.showAnalysis(analysis, text);
                    
                    // Восстанавливаем кнопку
                    analyzeBtn.innerHTML = originalText;
                    analyzeBtn.disabled = false;
                }, 800);
            });
        }

        // Очистка поля
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const textarea = document.getElementById('entryText');
                if (textarea.value.trim()) {
                    if (confirm('Очистить поле ввода?')) {
                        textarea.value = '';
                        textarea.style.height = '160px';
                        document.getElementById('analysisResult').classList.add('hidden');
                        UIManager.updateCharCount();
                        ToastManager.show('Поле очищено', 'info');
                    }
                }
            });
        }

        // Навигация
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                UIManager.loadHistory();
                UIManager.switchScreen('historyScreen');
            });
        }

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                UIManager.switchScreen('newEntryScreen');
            });
        }

        const backFromViewBtn = document.getElementById('backFromViewBtn');
        if (backFromViewBtn) {
            backFromViewBtn.addEventListener('click', () => {
                UIManager.switchScreen('historyScreen');
            });
        }

        // Экспорт JSON
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
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
                
                ToastManager.show('Данные экспортированы', 'success');
            });
        }

        // Импорт данных (скрытая функция для разработки)
        const handleImport = (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'I') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const success = EntryManager.importFromJSON(e.target.result);
                        if (success) {
                            ToastManager.show('Данные импортированы', 'success');
                            UIManager.loadHistory();
                            UIManager.updateStorageInfo();
                        } else {
                            ToastManager.show('Ошибка импорта', 'error');
                        }
                    };
                    reader.readAsText(file);
                };
                
                input.click();
            }
        };
        
        document.addEventListener('keydown', handleImport);
    },

    updateCharCount: () => {
        const textarea = document.getElementById('entryText');
        const count = textarea ? textarea.value.length : 0;
        const charCountElement = document.getElementById('charCount');
        
        if (charCountElement) {
            charCountElement.textContent = `${count} символов`;
        }
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли уже установленный PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Приложение запущено в режиме PWA');
    }
    
    // Проверяем поддержку Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
            console.log('Service Worker готов');
        });
    }
    
    // Инициализация UI
    UIManager.init();
});
