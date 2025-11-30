// sw.js - custom service worker to support push and voice reading for your app
self.addEventListener('push', function(event) {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'ரேஷன் டோக்கன்';
    const options = {
      body: data.tamilMessage || data.message || 'Notification',
      icon: './icon.png',
      badge: './badge.png',
      vibrate: [200,100,200],
      data: data
    };
    event.waitUntil(self.registration.showNotification(title, options));

    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'READ_NOTIFICATION_VOICE',
            tamilMessage: data.tamilMessage,
            message: data.message
          });
        });
      })
    );
  } catch(e){ console.log('push error', e); }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/customer.html'));
});

self.addEventListener('message', function(event) {
  // Allow pages to request SW to display notifications if needed
  if(event.data && event.data.showNotification){
    const d = event.data.showNotification;
    self.registration.showNotification(d.title, d.options || {});
  }
});
