// Service Worker для PWA
const CACHE_NAME = 'trace-v0-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.webmanifest'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование файлов приложения');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Стратегия кэширования: Network First, Fallback to Cache
self.addEventListener('fetch', event => {
    // Пропускаем не-GET запросы
    if (event.request.method !== 'GET') return;
    
    // Пропускаем chrome-extension запросы
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Клонируем ответ, потому что он может быть использован только один раз
                const responseClone = response.clone();
                
                // Кэшируем успешные ответы
                if (response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                }
                
                return response;
            })
            .catch(() => {
                // Если сеть недоступна, пытаемся получить из кэша
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Для навигационных запросов возвращаем закэшированный index.html
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        
                        // Можно вернуть fallback-страницу
                        return new Response('Нет соединения. Пожалуйста, проверьте подключение к интернету.', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Фоновая синхронизация (если понадобится в будущем)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        console.log('Фоновая синхронизация...');
        // Здесь можно добавить логику синхронизации
    }
});

// Обработка push-уведомлений (если понадобится в будущем)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление от TRACE',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('TRACE v0', options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
