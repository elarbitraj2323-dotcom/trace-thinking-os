// Ambient Background System - Premium Edition
class PremiumAmbientBackground {
    constructor() {
        this.canvas = document.getElementById('ambientCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isActive = true;
        this.lastTime = 0;
        this.frameCount = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            this.drawStaticBackground();
            return;
        }
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse move for parallax effect
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Touch events for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
        
        this.createParticles();
        this.animate();
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) {
                this.animate();
            }
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }
    
    drawStaticBackground() {
        this.resizeCanvas();
        
        // Create a subtle gradient for static background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f8f9ff');
        gradient.addColorStop(1, '#ffffff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add some static noise for texture
        this.addNoiseTexture();
    }
    
    addNoiseTexture() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 5;
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = noise;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 25000), 15);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 150 + 100,
                speedX: (Math.random() - 0.5) * 0.06,
                speedY: (Math.random() - 0.5) * 0.06,
                color: `rgba(${160 + Math.random() * 40}, ${170 + Math.random() * 40}, ${220 + Math.random() * 30}, ${0.02 + Math.random() * 0.02})`,
                originalX: Math.random() * this.canvas.width,
                originalY: Math.random() * this.canvas.height,
                timeOffset: Math.random() * Math.PI * 2,
                waveSpeed: 0.2 + Math.random() * 0.3,
                waveAmplitude: 20 + Math.random() * 40,
                parallaxFactor: 0.2 + Math.random() * 0.3
            });
        }
    }
    
    drawParticles(currentTime) {
        // Clear with subtle gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#fafaff');
        gradient.addColorStop(1, '#ffffff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            const time = currentTime * 0.001;
            
            // Calculate parallax effect based on mouse position
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const parallaxX = (this.mouse.x - centerX) * particle.parallaxFactor * 0.01;
            const parallaxY = (this.mouse.y - centerY) * particle.parallaxFactor * 0.01;
            
            // Add wave movement
            const waveX = Math.sin(time * particle.waveSpeed + particle.timeOffset) * particle.waveAmplitude;
            const waveY = Math.cos(time * particle.waveSpeed * 0.7 + particle.timeOffset) * particle.waveAmplitude;
            
            particle.x = particle.originalX + waveX + parallaxX;
            particle.y = particle.originalY + waveY + parallaxY;
            
            // Very slow drift
            particle.originalX += particle.speedX;
            particle.originalY += particle.speedY;
            
            // Boundary check with soft wrap
            if (particle.originalX > this.canvas.width + 200) particle.originalX = -200;
            if (particle.originalX < -200) particle.originalX = this.canvas.width + 200;
            if (particle.originalY > this.canvas.height + 200) particle.originalY = -200;
            if (particle.originalY < -200) particle.originalY = this.canvas.height + 200;
            
            // Draw particle as soft gradient blob
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.7, particle.color.replace('0.04', '0.02'));
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Add subtle noise overlay for texture
        this.addNoiseTexture();
    }
    
    animate(currentTime = 0) {
        if (!this.isActive || this.isReducedMotion) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update at 30fps for better performance
        if (deltaTime > 33) {
            this.drawParticles(currentTime);
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = [];
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        
        // Also remove on click
        toast.addEventListener('click', () => this.removeToast(toast));
    }
    
    removeToast(toast) {
        if (!toast.parentNode) return;
        
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
        
        setTimeout(() => {
            if (toast.parentNode) {
                this.container.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }
}

// App Configuration
const APP_CONFIG = {
    STORAGE_KEY: 'trace_premium_entries',
    USER_DICT_KEY: 'trace_premium_user_dictionary',
    VERSION: '1.0.0',
    MAX_ENTRIES: 200,
    MIN_TEXT_LENGTH: 10
};

// Enhanced Text Analyzer
class PremiumTextAnalyzer {
    constructor() {
        this.themes = {
            'Дом / Быт': ['дом', 'быт', 'уборка', 'ремонт', 'квартира', 'комната', 'кухня', 'мебель', 'техника'],
            'Животные': ['собака', 'щенок', 'пёс', 'кот', 'кошка', 'питомец', 'животное', 'зверь', 'котёнок'],
            'Радость / Позитив': ['радость', 'счастье', 'рад', 'доволен', 'восторг', 'веселье', 'праздник', 'успех'],
            'Отношения': ['друг', 'подруга', 'парень', 'девушка', 'муж', 'жена', 'семья', 'родители', 'любовь'],
            'Работа': ['работа', 'офис', 'начальник', 'коллега', 'зарплата', 'должность', 'карьера'],
            'Проекты': ['проект', 'задача', 'дедлайн', 'срок', 'клиент', 'разработка', 'планирование'],
            'Финансы': ['деньги', 'финансы', 'бюджет', 'доход', 'расход', 'кредит', 'долг', 'экономия'],
            'Здоровье': ['здоровье', 'болезнь', 'лекарство', 'врач', 'больница', 'диета', 'спорт', 'питание'],
            'Развитие': ['развитие', 'обучение', 'курс', 'книга', 'саморазвитие', 'навык', 'образование'],
            'Творчество': ['творчество', 'искусство', 'рисование', 'музыка', 'танец', 'пение', 'вдохновение']
        };
        
        this.emotions = {
            'Радость': ['радость', 'счастье', 'восторг', 'веселье', 'удовольствие', 'рад', 'доволен'],
            'Грусть': ['грусть', 'печаль', 'тоска', 'уныние', 'разочарование', 'сожаление', 'одиночество'],
            'Тревога': ['тревога', 'беспокойство', 'опасение', 'страх', 'испуг', 'паника', 'волнение'],
            'Злость': ['злость', 'гнев', 'ярость', 'раздражение', 'негодование', 'возмущение', 'обида'],
            'Усталость': ['усталость', 'устал', 'устала', 'изнеможение', 'истощение', 'сонливость', 'вялость'],
            'Спокойствие': ['спокойствие', 'умиротворение', 'гармония', 'баланс', 'расслабление', 'отдых', 'покой'],
            'Вдохновение': ['вдохновение', 'энтузиазм', 'подъём', 'идея', 'творческий', 'озарение', 'креатив']
        };
        
        this.userDictionary = this.loadUserDictionary();
    }
    
    loadUserDictionary() {
        try {
            const data = localStorage.getItem(APP_CONFIG.USER_DICT_KEY);
            return data ? JSON.parse(data) : { themes: {}, emotions: {} };
        } catch {
            return { themes: {}, emotions: {} };
        }
    }
    
    saveUserDictionary() {
        try {
            localStorage.setItem(APP_CONFIG.USER_DICT_KEY, JSON.stringify(this.userDictionary));
            return true;
        } catch {
            return false;
        }
    }
    
    addThemeToDictionary(theme, keywords) {
        if (!this.userDictionary.themes[theme]) {
            this.userDictionary.themes[theme] = [];
        }
        keywords.forEach(keyword => {
            if (!this.userDictionary.themes[theme].includes(keyword)) {
                this.userDictionary.themes[theme].push(keyword);
            }
        });
        this.saveUserDictionary();
    }
    
    addEmotionToDictionary(emotion, keywords) {
        if (!this.userDictionary.emotions[emotion]) {
            this.userDictionary.emotions[emotion] = [];
        }
        keywords.forEach(keyword => {
            if (!this.userDictionary.emotions[emotion].includes(keyword)) {
                this.userDictionary.emotions[emotion].push(keyword);
            }
        });
        this.saveUserDictionary();
    }
    
    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[ё]/g, 'е')
            .replace(/[^\wа-я\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    extractKeywords(text) {
        const normalized = this.normalizeText(text);
        const words = normalized.split(' ');
        
        return words.filter(word => 
            word.length > 2 && 
            !['это', 'что', 'как', 'для', 'меня', 'очень', 'мне', 'был', 'была', 'или', 'если', 'тот'].includes(word)
        );
    }
    
    analyze(text) {
        const trimmedText = text.trim();
        
        if (trimmedText.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            return this.getShortTextAnalysis();
        }
        
        const keywords = this.extractKeywords(trimmedText);
        
        if (keywords.length === 0) {
            return this.getInsufficientDataAnalysis();
        }
        
        // Combine base and user dictionaries
        const allThemes = { ...this.themes };
        const allEmotions = { ...this.emotions };
        
        Object.entries(this.userDictionary.themes).forEach(([theme, words]) => {
            if (!allThemes[theme]) allThemes[theme] = [];
            allThemes[theme] = [...new Set([...allThemes[theme], ...words])];
        });
        
        Object.entries(this.userDictionary.emotions).forEach(([emotion, words]) => {
            if (!allEmotions[emotion]) allEmotions[emotion] = [];
            allEmotions[emotion] = [...new Set([...allEmotions[emotion], ...words])];
        });
        
        // Detect themes
        const themeScores = {};
        keywords.forEach(keyword => {
            Object.entries(allThemes).forEach(([theme, themeWords]) => {
                if (themeWords.some(themeWord => 
                    keyword.includes(themeWord) || themeWord.includes(keyword))) {
                    themeScores[theme] = (themeScores[theme] || 0) + 1;
                }
            });
        });
        
        let detectedThemes = Object.entries(themeScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
            
        if (detectedThemes.length === 0) {
            detectedThemes = ['Недостаточно данных / Другое'];
        }
        
        // Detect emotions
        const emotionScores = {};
        keywords.forEach(keyword => {
            Object.entries(allEmotions).forEach(([emotion, emotionWords]) => {
                if (emotionWords.some(emotionWord => 
                    keyword.includes(emotionWord) || emotionWord.includes(keyword))) {
                    emotionScores[emotion] = (emotionScores[emotion] || 0) + 1;
                }
            });
        });
        
        let detectedEmotions = Object.entries(emotionScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(entry => entry[0]);
            
        if (detectedEmotions.length === 0) {
            detectedEmotions = ['Не определено'];
        }
        
        return {
            summary: this.generateSummary(trimmedText, detectedThemes, detectedEmotions),
            themes: detectedThemes,
            emotions: detectedEmotions,
            question: this.generateQuestion(detectedThemes[0]),
            recommendation: this.generateRecommendation(detectedEmotions[0]),
            meta: {
                words: keywords.length,
                sentences: trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
                analyzedAt: new Date().toISOString()
            }
        };
    }
    
    getShortTextAnalysis() {
        return {
            summary: 'Текст слишком короткий для глубокого анализа. Попробуйте описать свои мысли подробнее.',
            themes: ['Текст слишком короткий'],
            emotions: ['Текст слишком короткий'],
            question: 'Что ещё вы хотели бы добавить к этой мысли?',
            recommendation: {
                type: 'wait',
                label: 'Подождать',
                text: 'Добавьте больше деталей для получения точной рекомендации.'
            },
            meta: {
                words: 0,
                sentences: 0,
                analyzedAt: new Date().toISOString()
            }
        };
    }
    
    getInsufficientDataAnalysis() {
        return {
            summary: 'Текст не содержит достаточно ключевых слов для анализа. Попробуйте быть более конкретным.',
            themes: ['Недостаточно данных / Другое'],
            emotions: ['Не определено'],
            question: 'Что именно вас беспокоит или радует в этой ситуации?',
            recommendation: {
                type: 'wait',
                label: 'Подождать',
                text: 'Опишите ситуацию более подробно для получения рекомендации.'
            },
            meta: {
                words: 0,
                sentences: 0,
                analyzedAt: new Date().toISOString()
            }
        };
    }
    
    generateSummary(text, themes, emotions) {
        if (themes[0] === 'Текст слишком короткий') {
            return 'Текст слишком короткий для анализа.';
        }
        
        if (themes[0] === 'Недостаточно данных / Другое') {
            return 'Текст требует более подробного описания для анализа.';
        }
        
        const wordCount = text.split(/\s+/).length;
        const mainTheme = themes[0];
        const mainEmotion = emotions[0];
        
        let summary = `Основная тема: ${mainTheme.toLowerCase()}. `;
        
        if (mainEmotion !== 'Не определено') {
            summary += `Преобладающая эмоция: ${mainEmotion.toLowerCase()}. `;
        }
        
        if (wordCount < 20) {
            summary += 'Запись краткая, но уже позволяет сделать некоторые выводы.';
        } else if (wordCount < 50) {
            summary += 'Достаточно деталей для содержательного анализа.';
        } else {
            summary += 'Подробное описание позволяет провести глубокий анализ.';
        }
        
        return summary;
    }
    
    generateQuestion(theme) {
        const questions = {
            'Дом / Быт': 'Что в вашем домашнем пространстве требует изменения?',
            'Животные': 'Как ваш питомец влияет на ваше эмоциональное состояние?',
            'Радость / Позитив': 'Что именно вызвало у вас эти позитивные чувства?',
            'Отношения': 'Как это повлияло на ваши отношения с близкими?',
            'Работа': 'Что самое важное в этой рабочей ситуации для вас?',
            'Проекты': 'Какой следующий шаг будет ключевым в вашем проекте?',
            'Финансы': 'Как это решение отразится на вашем финансовом положении?',
            'Здоровье': 'Что вы можете сделать для своего здоровья прямо сейчас?',
            'Развитие': 'Чему бы вы хотели научиться в ближайшее время?',
            'Творчество': 'Что вдохновляет вас на творчество в последнее время?'
        };
        
        return questions[theme] || 'Что для вас самое важное в этой ситуации?';
    }
    
    generateRecommendation(emotion) {
        const recommendations = {
            'Радость': {
                type: 'do',
                label: 'Действовать',
                text: 'Ваше эмоциональное состояние благоприятно для активных действий. Используйте эту энергию.'
            },
            'Грусть': {
                type: 'wait',
                label: 'Подождать',
                text: 'Дайте себе время на восстановление эмоциональных сил. Важные решения лучше принимать в спокойном состоянии.'
            },
            'Тревога': {
                type: 'dont',
                label: 'Не действовать',
                text: 'В состоянии тревоги решения могут быть необъективными. Сначала успокойтесь.'
            },
            'Злость': {
                type: 'dont',
                label: 'Не действовать',
                text: 'Сильные эмоции мешают трезвой оценке. Отложите решения до успокоения.'
            },
            'Усталость': {
                type: 'wait',
                label: 'Подождать',
                text: 'Организму нужен отдых. Принимайте решения после восстановления сил.'
            },
            'Спокойствие': {
                type: 'wait',
                label: 'Подождать',
                text: 'Вы в уравновешенном состоянии. Можно не спешить с решениями, собрать больше информации.'
            },
            'Вдохновение': {
                type: 'do',
                label: 'Действовать',
                text: 'Вдохновение — ценный ресурс. Используйте этот творческий подъём для реализации идей.'
            }
        };
        
        return recommendations[emotion] || {
            type: 'wait',
            label: 'Подождать',
            text: 'Недостаточно данных для точной рекомендации. Подумайте ещё над ситуацией.'
        };
    }
}

// Entry Manager
class PremiumEntryManager {
    constructor() {
        this.entries = this.loadEntries();
    }
    
    loadEntries() {
        try {
            const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
    
    saveEntries() {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(this.entries));
            return true;
        } catch {
            return false;
        }
    }
    
    addEntry(text, analysis) {
        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            text: text.trim(),
            analysis: analysis
        };
        
        this.entries.unshift(entry);
        
        if (this.entries.length > APP_CONFIG.MAX_ENTRIES) {
            this.entries = this.entries.slice(0, APP_CONFIG.MAX_ENTRIES);
        }
        
        return this.saveEntries() ? entry : null;
    }
    
    getEntry(id) {
        return this.entries.find(entry => entry.id === id);
    }
    
    deleteEntry(id) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        return this.saveEntries();
    }
    
    getAllEntries() {
        return [...this.entries];
    }
    
    getStats() {
        return {
            total: this.entries.length,
            lastEntry: this.entries.length > 0 ? this.entries[0].date : null,
            storageUsed: JSON.stringify(this.entries).length
        };
    }
    
    exportToJSON() {
        const data = {
            app: 'TRACE Premium',
            version: APP_CONFIG.VERSION,
            exportedAt: new Date().toISOString(),
            entries: this.entries
        };
        
        return JSON.stringify(data, null, 2);
    }
}

// Main App Class
class TracePremiumApp {
    constructor() {
        this.ambientBg = new PremiumAmbientBackground();
        this.toastManager = new ToastManager();
        this.textAnalyzer = new PremiumTextAnalyzer();
        this.entryManager = new PremiumEntryManager();
        
        this.currentText = '';
        this.currentAnalysis = null;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
        
        this.setupEventListeners();
        this.setupTextarea();
        this.loadHistory();
        this.updateStorageInfo();
    }
    
    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const dateTimeElement = document.getElementById('currentDateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = now.toLocaleDateString('ru-RU', options);
        }
    }
    
    setupTextarea() {
        const textarea = document.getElementById('entryText');
        if (!textarea) return;
        
        textarea.addEventListener('input', (e) => {
            this.currentText = e.target.value;
            this.updateCharCount();
            
            // Auto-resize with premium animation
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 400);
            
            if (!this.isReducedMotion) {
                textarea.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                textarea.style.height = `${newHeight}px`;
            } else {
                textarea.style.height = `${newHeight}px`;
            }
        });
        
        textarea.addEventListener('focus', () => {
            if (!this.isReducedMotion) {
                textarea.parentElement.classList.add('focused');
            }
        });
        
        textarea.addEventListener('blur', () => {
            textarea.parentElement.classList.remove('focused');
        });
    }
    
    updateCharCount() {
        const charCountElement = document.getElementById('charCount');
        if (charCountElement) {
            charCountElement.textContent = `${this.currentText.length} символов`;
        }
    }
    
    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEntry());
        }
        
        // Analyze button
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeText());
        }
        
        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearText());
        }
        
        // Navigation buttons
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
        }
        
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showNewEntry());
        }
        
        const backFromViewBtn = document.getElementById('backFromViewBtn');
        if (backFromViewBtn) {
            backFromViewBtn.addEventListener('click', () => this.showHistory());
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // Correction buttons
        const fixThemeBtn = document.getElementById('fixThemeBtn');
        if (fixThemeBtn) {
            fixThemeBtn.addEventListener('click', () => this.showThemeCorrection());
        }
        
        const fixEmotionBtn = document.getElementById('fixEmotionBtn');
        if (fixEmotionBtn) {
            fixEmotionBtn.addEventListener('click', () => this.showEmotionCorrection());
        }
        
        const saveThemeBtn = document.getElementById('saveThemeCorrection');
        if (saveThemeBtn) {
            saveThemeBtn.addEventListener('click', () => this.saveThemeCorrection());
        }
        
        const saveEmotionBtn = document.getElementById('saveEmotionCorrection');
        if (saveEmotionBtn) {
            saveEmotionBtn.addEventListener('click', () => this.saveEmotionCorrection());
        }
    }
    
    saveEntry() {
        if (this.currentText.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            this.toastManager.show(`Минимум ${APP_CONFIG.MIN_TEXT_LENGTH} символов`, 'error');
            return;
        }
        
        const analysis = this.textAnalyzer.analyze(this.currentText);
        const entry = this.entryManager.addEntry(this.currentText, analysis);
        
        if (entry) {
            this.toastManager.show('Запись сохранена', 'success');
            this.clearText();
            this.loadHistory();
            this.updateStorageInfo();
        } else {
            this.toastManager.show('Ошибка сохранения', 'error');
        }
    }
    
    analyzeText() {
        if (this.currentText.length < APP_CONFIG.MIN_TEXT_LENGTH) {
            this.toastManager.show(`Минимум ${APP_CONFIG.MIN_TEXT_LENGTH} символов для анализа`, 'error');
            return;
        }
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        const originalContent = analyzeBtn.innerHTML;
        
        // Show loading state with premium animation
        analyzeBtn.innerHTML = '<span class="btn-content"><span class="btn-icon">⏳</span><span class="btn-text">Анализируем...</span></span>';
        analyzeBtn.disabled = true;
        
        // Simulate analysis delay for better UX
        setTimeout(() => {
            this.currentAnalysis = this.textAnalyzer.analyze(this.currentText);
            this.showAnalysis(this.currentAnalysis);
            
            // Restore button with animation
            analyzeBtn.innerHTML = originalContent;
            analyzeBtn.disabled = false;
        }, 800);
    }
    
    showAnalysis(analysis) {
        const analysisContainer = document.getElementById('analysisResult');
        const analysisTime = document.getElementById('analysisTime');
        
        // Update analysis time
        if (analysisTime) {
            const now = new Date();
            analysisTime.textContent = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Update content with smooth transitions
        const updateWithAnimation = (element, text) => {
            if (element) {
                if (!this.isReducedMotion) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        element.textContent = text;
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                } else {
                    element.textContent = text;
                }
            }
        };
        
        updateWithAnimation(document.getElementById('summaryText'), analysis.summary);
        updateWithAnimation(document.getElementById('questionText'), analysis.question);
        updateWithAnimation(document.getElementById('recommendationText'), analysis.recommendation.text);
        
        const recommendationBadge = document.getElementById('recommendationType');
        if (recommendationBadge) {
            recommendationBadge.textContent = analysis.recommendation.label;
            recommendationBadge.className = `recommendation-badge ${analysis.recommendation.type}`;
        }
        
        // Update themes
        const themesList = document.getElementById('themesList');
        if (themesList) {
            themesList.innerHTML = analysis.themes
                .map(theme => `<span>${theme}</span>`)
                .join('');
        }
        
        // Update emotions
        const emotionsList = document.getElementById('emotionsList');
        if (emotionsList) {
            emotionsList.innerHTML = analysis.emotions
                .map(emotion => `<span>${emotion}</span>`)
                .join('');
        }
        
        // Show analysis with premium animation
        if (!this.isReducedMotion) {
            analysisContainer.classList.remove('hidden');
            
            setTimeout(() => {
                analysisContainer.classList.add('show');
                
                // Scroll to analysis smoothly
                setTimeout(() => {
                    analysisContainer.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            }, 50);
        } else {
            analysisContainer.classList.remove('hidden');
        }
        
        // Add fade-in animations to sections
        const sections = analysisContainer.querySelectorAll('.fade-in');
        sections.forEach((section, index) => {
            if (!this.isReducedMotion) {
                section.style.animationDelay = `${index * 0.1}s`;
            } else {
                section.style.opacity = '1';
            }
        });
    }
    
    clearText() {
        const textarea = document.getElementById('entryText');
        const analysisContainer = document.getElementById('analysisResult');
        
        if (textarea.value.trim() === '') return;
        
        if (confirm('Очистить поле ввода?')) {
            textarea.value = '';
            this.currentText = '';
            textarea.style.height = 'auto';
            this.updateCharCount();
            
            if (analysisContainer) {
                if (!this.isReducedMotion) {
                    analysisContainer.classList.remove('show');
                    setTimeout(() => {
                        analysisContainer.classList.add('hidden');
                    }, 300);
                } else {
                    analysisContainer.classList.add('hidden');
                }
            }
            
            this.toastManager.show('Текст очищен', 'info');
        }
    }
    
    showHistory() {
        this.switchScreen('historyScreen');
        
        const historyCount = document.getElementById('historyCount');
        const entries = this.entryManager.getAllEntries();
        
        if (historyCount) {
            historyCount.textContent = `${entries.length} записей`;
        }
    }
    
    showNewEntry() {
        this.switchScreen('newEntryScreen');
    }
    
    switchScreen(screenId) {
        // Hide all screens with animation
        document.querySelectorAll('.screen').forEach(screen => {
            if (!this.isReducedMotion) {
                screen.style.opacity = '0';
                screen.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    screen.classList.remove('active');
                    screen.style.opacity = '';
                    screen.style.transform = '';
                }, 200);
            } else {
                screen.classList.remove('active');
            }
        });
        
        // Show target screen with animation
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            if (!this.isReducedMotion) {
                targetScreen.style.opacity = '0';
                targetScreen.style.transform = 'translateY(20px)';
                targetScreen.classList.add('active');
                
                setTimeout(() => {
                    targetScreen.style.opacity = '1';
                    targetScreen.style.transform = 'translateY(0)';
                    targetScreen.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
                
                setTimeout(() => {
                    targetScreen.style.opacity = '';
                    targetScreen.style.transform = '';
                    targetScreen.style.transition = '';
                }, 400);
            } else {
                targetScreen.classList.add('active');
            }
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: this.isReducedMotion ? 'auto' : 'smooth' });
    }
    
    loadHistory() {
        const historyList = document.getElementById('historyList');
        const entries = this.entryManager.getAllEntries();
        
        if (!historyList) return;
        
        if (entries.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3 class="empty-title">Пока нет записей</h3>
                    <p class="empty-description premium-text">Ваши мысли появятся здесь</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = entries.map(entry => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const preview = entry.text.length > 120 
                ? entry.text.substring(0, 120) + '...' 
                : entry.text;
            
            const themes = entry.analysis?.themes?.slice(0, 2) || [];
            
            return `
                <div class="history-item" data-id="${entry.id}">
                    <div class="history-item-header">
                        <div class="history-date">${formattedDate}</div>
                    </div>
                    <div class="history-preview">${preview}</div>
                    ${themes.length > 0 ? `
                        <div class="history-themes">
                            ${themes.map(theme => `<span>${theme}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Add click handlers with animation
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.isReducedMotion) {
                    item.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }
                
                const entryId = item.dataset.id;
                setTimeout(() => {
                    this.showEntry(entryId);
                }, 200);
            });
        });
    }
    
    showEntry(entryId) {
        const entry = this.entryManager.getEntry(entryId);
        if (!entry) return;
        
        const date = new Date(entry.date);
        const viewEntryDate = document.getElementById('viewEntryDate');
        if (viewEntryDate) {
            viewEntryDate.textContent = date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        const viewEntryText = document.getElementById('viewEntryText');
        if (viewEntryText) {
            viewEntryText.textContent = entry.text;
        }
        
        if (entry.analysis) {
            const analysisDate = document.getElementById('analysisDate');
            if (analysisDate) {
                const analysisTime = new Date(entry.analysis.meta.analyzedAt);
                analysisDate.textContent = analysisTime.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            document.getElementById('viewSummary').textContent = entry.analysis.summary;
            document.getElementById('viewQuestion').textContent = entry.analysis.question;
            document.getElementById('viewRecommendationText').textContent = entry.analysis.recommendation.text;
            
            const recommendationBadge = document.getElementById('viewRecommendationType');
            recommendationBadge.textContent = entry.analysis.recommendation.label;
            recommendationBadge.className = `recommendation-badge ${entry.analysis.recommendation.type}`;
            
            const viewThemes = document.getElementById('viewThemes');
            if (viewThemes) {
                viewThemes.innerHTML = entry.analysis.themes
                    .map(theme => `<span>${theme}</span>`)
                    .join('');
            }
            
            const viewEmotions = document.getElementById('viewEmotions');
            if (viewEmotions) {
                viewEmotions.innerHTML = entry.analysis.emotions
                    .map(emotion => `<span>${emotion}</span>`)
                    .join('');
            }
        }
        
        this.switchScreen('viewEntryScreen');
    }
    
    updateStorageInfo() {
        const stats = this.entryManager.getStats();
        const storageInfo = document.getElementById('storageInfo');
        
        if (storageInfo) {
            if (stats.total === 0) {
                storageInfo.textContent = 'Нет сохранённых записей';
            } else {
                const lastDate = new Date(stats.lastEntry);
                const formattedDate = lastDate.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                });
                storageInfo.textContent = `${stats.total} записей, последняя: ${formattedDate}`;
            }
        }
    }
    
    exportData() {
        const jsonData = this.entryManager.exportToJSON();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `trace_premium_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.toastManager.show('Данные экспортированы', 'success');
    }
    
    showThemeCorrection() {
        document.getElementById('themeCorrection').classList.remove('hidden');
        document.getElementById('emotionCorrection').classList.add('hidden');
    }
    
    showEmotionCorrection() {
        document.getElementById('emotionCorrection').classList.remove('hidden');
        document.getElementById('themeCorrection').classList.add('hidden');
    }
    
    saveThemeCorrection() {
        const selectedTheme = document.getElementById('themeSelect').value;
        if (!selectedTheme) {
            this.toastManager.show('Выберите тему', 'error');
            return;
        }
        
        const keywords = this.textAnalyzer.extractKeywords(this.currentText);
        this.textAnalyzer.addThemeToDictionary(selectedTheme, keywords);
        
        this.toastManager.show('Тема исправлена', 'success');
        document.getElementById('themeCorrection').classList.add('hidden');
        
        // Re-analyze with updated dictionary
        this.currentAnalysis = this.textAnalyzer.analyze(this.currentText);
        this.showAnalysis(this.currentAnalysis);
    }
    
    saveEmotionCorrection() {
        const selectedEmotion = document.getElementById('emotionSelect').value;
        if (!selectedEmotion) {
            this.toastManager.show('Выберите эмоцию', 'error');
            return;
        }
        
        const keywords = this.textAnalyzer.extractKeywords(this.currentText);
        this.textAnalyzer.addEmotionToDictionary(selectedEmotion, keywords);
        
        this.toastManager.show('Эмоция исправлена', 'success');
        document.getElementById('emotionCorrection').classList.add('hidden');
        
        // Re-analyze with updated dictionary
        this.currentAnalysis = this.textAnalyzer.analyze(this.currentText);
        this.showAnalysis(this.currentAnalysis);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.traceApp = new TracePremiumApp();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.error('Service Worker registration failed:', err));
    }
    
    // Add CSS for animations
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.textContent = `
            .btn-premium-primary:hover {
                transform: translateY(-3px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .btn-premium-primary:active {
                transform: translateY(-1px);
                transition: transform 0.1s;
            }
            
            .premium-card {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .premium-card:hover {
                transform: translateY(-4px);
            }
            
            .history-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .history-item:hover {
                transform: translateY(-3px);
            }
            
            .premium-tags span {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .premium-tags span:hover {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
});
