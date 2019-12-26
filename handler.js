/**
 * Get all elements
 *
 *
 * @type {HTMLElement}
 */
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const subscriptionTextarea = document.getElementById('subscription');

/**
 * The functionality will work if the browser supports both the service worker and push manager.
 */
if (!'serviceWorker' in navigator || !'PushManager' in window) {
    document.getElementById('content').textContent = "Functionality won't work";
} else {
    // request for showing browser notification
    Notification.requestPermission();
    // register service worker
    registerServiceWorker();
    // add event listener for subscribe button
    subscribeButton.addEventListener('click', subscribe);
    // add event listener for unsubscribe button
    unsubscribeButton.addEventListener('click', unsubscribe);
    // initialize the subscription status and buttons
    initButtons();
}

/**
 * Register the service worker
 */
function registerServiceWorker() {
    navigator.serviceWorker.register('sw.js')
        .then(
            function (registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }
        )
        .catch(function (err) {
            alert('ServiceWorker registration failed');
            console.error('ServiceWorker registration failed: ', err);
        });
}

/**
 * Initialize the buttons by checking the service worker status and the subscription status
 * Hide/show the buttons and subscription data according to the status
 */
function initButtons() {
    // if the service worker is ready
    navigator.serviceWorker.ready
        .then(function (registration) {
            // get the subscription from the push manager
            registration.pushManager.getSubscription()
                .then(function (subscription) {
                    // if subscribed already
                    if (subscription) {
                        // hide the subscribe button
                        subscribeButton.style.display = "none";
                        // show the unsubscribe button
                        unsubscribeButton.style.display = "block";
                        // show subscription data
                        subscriptionTextarea.style.display = "block";
                        subscriptionTextarea.innerText = JSON.stringify(subscription);
                    } else {
                        // show subscription button
                        subscribeButton.style.display = "block";
                        // hide unsubscribe button
                        unsubscribeButton.style.display = "none";
                        // hide subscription data
                        subscriptionTextarea.style.display = "none";
                    }
                })
        });
}

/**
 * Trigger when clicking the subscribe option
 * Use the subscription public key here
 *
 * @param event
 */
function subscribe(event) {
    // prevent default actions
    event.preventDefault();
    // subscription processing
    navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.subscribe({
            userVisibleOnly: true, //Always show notification when received
            applicationServerKey: urlBase64ToUint8Array(
                'BOwAikTNwh3JmmrXz7DHsclNkD8xlviX30LdCdrBFmpVI6bDVncfQFaBuR0J2UKishaQ-XldL_5cwxCYevRbq_I'
            )
        })
            .then(function (subscription) {
                // change the state of buttons if success
                initButtons();
            })
            .catch(function (error) {
                console.error('Error occurred while enabling push ', error);
            });
    });
}

/**
 * Trigger when clicking the unsubscribe button
 * Stop showing notifications
 *
 * @param event
 */
function unsubscribe(event) {
    // prevent default actions
    event.preventDefault();
    // unsubscription process
    navigator.serviceWorker.ready
        .then(function (registration) {
            registration.pushManager.getSubscription()
                .then(function (subscription) {
                    if (!subscription) {
                        alert('Unable to unregister push notification.');
                        return;
                    }
                    subscription.unsubscribe()
                        .then(function () {
                            // set the buttons
                            initButtons();
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                })
        });
}

/**
 * Convert base 64 string to Uint8Array array
 *
 * @param base64String
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}