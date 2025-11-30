// firebase-messaging-sw.js - handles background FCM messages
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDd-tU2V_wV2lwaX3_AkdDZZf3c-rA54VE",
  authDomain: "new-idea-1f401.firebaseapp.com",
  databaseURL: "https://new-idea-1f401-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-idea-1f401",
  storageBucket: "new-idea-1f401.firebasestorage.app",
  messagingSenderId: "34069771276",
  appId: "1:34069771276:web:7af73f0e682f5d8b806a29",
  measurementId: "G-C7RR1MWT9V"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Ration Shop';
  const options = {
    body: payload.notification?.body || payload.data?.message || 'New announcement',
    icon: '/icon.png',
    badge: '/badge.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/home.html'));
});
