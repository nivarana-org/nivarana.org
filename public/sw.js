self.addEventListener('push', function (event) {
    if (event.data) {
      const payload = event.data.json()
      const options = {
        body: payload.body,
        icon: payload.icon || '/icon.png',
        badge: '/icon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          url: payload.url
        },
        requireInteraction: true,
      }
      event.waitUntil(self.registration.showNotification(payload.title, options))
    }
  })
   
  self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    event.waitUntil(clients.openWindow(event.notification.data.url))
  })