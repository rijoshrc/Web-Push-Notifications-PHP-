'use strict';

const applicationServerPublicKey = 'BOwAikTNwh3JmmrXz7DHsclNkD8xlviX30LdCdrBFmpVI6bDVncfQFaBuR0J2UKishaQ-XldL_5cwxCYevRbq_I';

/**
 * Convert base 64 string to Uint8Array
 * @param base64String
 * @returns {Uint8Array}
 */
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Listen for the push event
 * Trigger notification
 */
self.addEventListener('push', function (event) {
    const title = 'Push Codelab';
    const options = {
        body: event.data.text(),
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Trigger on clicking the notification
 */
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});

/**
 * Change the subscription listener
 */
self.addEventListener('pushsubscriptionchange', function (event) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function (newSubscription) {
                // TODO: Send to application server
                console.log('[Service Worker] New subscription: ', newSubscription);
            })
    );
});
