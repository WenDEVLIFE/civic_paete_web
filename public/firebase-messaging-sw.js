importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Default Firebase configuration for service worker background notification listener
const firebaseConfig = {
  apiKey: "AIzaSyCivicPaeteWebPushKey",
  authDomain: "civic-paete.firebaseapp.com",
  projectId: "civic-paete",
  storageBucket: "civic-paete.firebasestorage.app",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:civicpaeteapp",
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    const title = payload.notification?.title || payload.data?.title || 'Civic Paete — Incident Update';
    const body = payload.notification?.body || payload.data?.body || 'An update was posted on your community report.';
    const reportId = payload.data?.reportId || '';

    const notificationOptions = {
      body: body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: reportId ? `report-${reportId}` : 'civic-paete-alert',
      data: {
        url: reportId ? `/reports/${reportId}` : '/',
        ...payload.data,
      },
      actions: [
        { action: 'open_report', title: 'View Report Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    self.registration.showNotification(title, notificationOptions);
  });
} catch (error) {
  console.warn('[firebase-messaging-sw.js] Service Worker initialization notice:', error);
}

// Handle notification click to navigate to the updated report
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
