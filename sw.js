const CACHE_NAME = 'vito-math-v1';
const urlsToCache = [
  '.',
  './index.html',
  './index.tsx',
  './metadata.json',
  './App.tsx',
  './types.ts',
  './services/geminiService.ts',
  './services/audioService.ts',
  './components/StartScreen.tsx',
  './components/Game.tsx',
  './components/HUD.tsx',
  './components/Player.tsx',
  './components/QuestionModal.tsx',
  './components/icons/index.tsx',
  './components/Background.tsx',
  './components/Platform.tsx',
  './components/Gem.tsx',
  './components/UndergroundBackground.tsx',
  './components/Tortubit.tsx',
  './components/HelpModal.tsx',
  './vite.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});