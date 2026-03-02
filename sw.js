// ════════════════════════════════════════════════════════════════════════
//  VF SIGNAL PREDICTOR — SERVICE WORKER v7.1
//  Handles: offline caching, background sync, keep-alive pings,
//           periodic background sync, push notifications
// ════════════════════════════════════════════════════════════════════════

const SW_VERSION = 'vf-predictor-v7.1';
const CACHE_NAME = `${SW_VERSION}-cache`;
const SYNC_TAG   = 'vf-signal-sync';
const PERIODIC_TAG = 'vf-periodic-sync';

// Files to cache for offline use
const CORE_FILES = [
  '/',
  '/index.html',
];

// ─── INSTALL ─────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing', SW_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())   // Activate immediately, don't wait
  );
});

// ─── ACTIVATE ────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating', SW_VERSION);
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME)
            .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
        )
      ),
      // Take control of all open tabs immediately
      self.clients.claim()
    ])
  );
});

// ─── FETCH (Cache-First for app shell, Network-First for API) ─────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never cache API calls (signals, predictions, proxy requests)
  const isAPI = url.hostname.includes('railway.app') ||
                url.hostname.includes('kir0n.com') ||
                url.hostname.includes('kirongaming.com') ||
                url.hostname.includes('allorigins.win') ||
                url.hostname.includes('corsproxy.io') ||
                url.hostname.includes('codetabs.com') ||
                url.hostname.includes('betpawa');

  if (isAPI) {
    // Network only for APIs — don't interfere
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for app shell (HTML, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Serve from cache, then update cache in background (stale-while-revalidate)
        fetch(event.request)
          .then(fresh => {
            if (fresh && fresh.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, fresh.clone()));
            }
          })
          .catch(() => {}); // Ignore network errors on background update
        return cached;
      }
      // Not in cache — fetch from network
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Full offline fallback
        return caches.match('/index.html');
      });
    })
  );
});

// ─── BACKGROUND SYNC ─────────────────────────────────────────────────
// Fires when connectivity is restored after being offline
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === SYNC_TAG) {
    event.waitUntil(notifyClientsToRefresh('sync'));
  }
});

// ─── PERIODIC BACKGROUND SYNC ─────────────────────────────────────────
// Fires periodically even when app is closed (Android Chrome + PWA installed)
// Interval set by the app when registering — typically every 3–5 minutes for VFL
self.addEventListener('periodicsync', event => {
  console.log('[SW] Periodic sync fired:', event.tag);
  if (event.tag === PERIODIC_TAG) {
    event.waitUntil(
      handlePeriodicSync()
    );
  }
});

async function handlePeriodicSync() {
  // Notify any open windows/tabs to refresh predictions
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  if (clients.length > 0) {
    // App is open — just tell it to refresh
    clients.forEach(client => {
      client.postMessage({ type: 'PERIODIC_SYNC', action: 'refresh' });
    });
  } else {
    // App is closed — fetch quietly and show a notification if new picks found
    await checkForNewPredictionsAndNotify();
  }
}

async function checkForNewPredictionsAndNotify() {
  try {
    // Try to reach the BetPawa proxy to check for upcoming rounds
    const res = await fetch('https://betpawa-proxy-production.up.railway.app/api/sportsbook/virtual/v1/seasons/list/actual', {
      headers: { 'X-Pawa-Brand': 'betpawa-zambia' },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return;

    const data = await res.json();
    const now = new Date();
    let nextRoundIn = null;
    let nextRoundName = null;

    for (const season of (data.items || [])) {
      for (const round of (season.rounds || [])) {
        const rs = new Date(round.tradingTime?.start);
        if (rs > now) {
          const diffMs = rs - now;
          const diffMin = Math.floor(diffMs / 60000);
          // Alert if a round is starting within 8 minutes (MD+2 window)
          if (diffMin <= 8 && diffMin >= 0) {
            nextRoundIn = diffMin;
            nextRoundName = round.name;
          }
          break;
        }
      }
    }

    if (nextRoundIn !== null) {
      await self.registration.showNotification('⚡ VF Signal Predictor', {
        body: `📅 Matchday ${nextRoundName} starts in ${nextRoundIn} min. Open app to check predictions.`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'vf-round-alert',
        renotify: true,
        vibrate: [200, 100, 200],
        data: { url: '/?tab=live' },
        actions: [
          { action: 'open', title: '🔍 View Predictions' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    }
  } catch (e) {
    console.warn('[SW] Background check failed:', e.message);
  }
}

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { payload = { title: 'VF Predictor', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(payload.title || '⚡ VF Signal Predictor', {
      body: payload.body || 'New prediction available',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.tag || 'vf-push',
      vibrate: [200, 100, 200],
      data: { url: payload.url || '/' }
    })
  );
});

// ─── NOTIFICATION CLICK ───────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // If app already open, focus it
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
          return;
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// ─── MESSAGE HANDLER ──────────────────────────────────────────────────
// Receives messages from the main app
self.addEventListener('message', event => {
  const { type, data } = event.data || {};

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (type === 'KEEP_ALIVE') {
    // App is pinging the SW to prevent suspension
    event.source?.postMessage({ type: 'ALIVE', ts: Date.now() });
  }

  if (type === 'REGISTER_PERIODIC_SYNC') {
    // App requests to register periodic sync
    registerPeriodicSync().then(result => {
      event.source?.postMessage({ type: 'PERIODIC_SYNC_STATUS', supported: result });
    });
  }
});

async function registerPeriodicSync() {
  try {
    const status = await self.registration.periodicSync?.getRegistrations();
    if (!status) return false;
    const alreadyRegistered = status.some(s => s.tag === PERIODIC_TAG);
    if (!alreadyRegistered) {
      await self.registration.periodicSync.register(PERIODIC_TAG, {
        minInterval: 3 * 60 * 1000  // Every 3 minutes (matches VFL round interval)
      });
    }
    return true;
  } catch (e) {
    console.warn('[SW] Periodic sync not supported:', e.message);
    return false;
  }
}

async function notifyClientsToRefresh(reason) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  clients.forEach(client => client.postMessage({ type: 'SW_REFRESH', reason }));
}

console.log('[SW] VF Signal Predictor Service Worker loaded:', SW_VERSION);
