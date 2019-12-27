# PHP-ServiceWorker push notification (Implementation of [web-push-php](https://github.com/web-push-libs/web-push-php) package)
A service worker can handle push notifications that can be shown even when the browser tab or the browser itself is closed. Implementing this using PHP, JS and HTML require a third party service. The plugin [web-push-php](https://github.com/web-push-libs/web-push-php) can help this to happen. Clone the directory to your localhost area and check how it can be implemented.

## Requirements
* PHP 7.1+
  * gmp
  * mbstring
  * curl
  * opensslPHP 7.2+ is recommended for better performance.

There is no support and maintenance for older PHP versions, however you are free to use the following compatible versions:
- PHP 5.6 or HHVM: `v1.x`
- PHP 7.0: `v2.x`

Since we're using advanced browser properties like *serviceWorker* and *PushManager*, ensure that your browser supporting all these properties before start.
Check the browser support [here](https://caniuse.com/).

## Installation
Use [composer](https://getcomposer.org/) to download and install the library and its dependencies.
1. Clone the directory to your localhost location.
2. Run command `composer install` to install the required plugins.
3. Open http://localhost/php-service-worker-push-notification/ in your browser.

## Usage

- Click Allow button if the browser show permission prompt.
- Go to the browser application tab to see the service worker file is registered. You can check the working by clicking the `Push` button in this section.
- Click the `Get notification` link to get the subscription. Copy the subscription data from the textarea.
- Send the subscription data to http://localhost/php-service-worker-push-notification/trigger using [postman](https://www.getpostman.com/). Use `POST` method and send as `form-data` by assigning to the key `subscription`.
---
##### VAPID
- Use [this](https://web-push-codelab.glitch.me/) link to generate the demo VAPIDs.
- Copy the `public  key` and `private key` and paste it in the code.
- These VAPIDs has limitations and can use only for testing purpose.
 
*trigger.php*
``` 
    $auth = array(
                'VAPID' => array(
                    'subject' => 'http://localhost:8887/',
                    'publicKey' => 'YOUR_PUBLIC_KEY',
                    'privateKey' => 'YOUR _PRIVATE_KEY',
                ),
            );
``` 
 *handler.js*
 ```
    const PUBLIC_KEY = YOUR_PUBLIC_KEY;
```
*sw.js*
```
    const applicationServerPublicKey = YOUR_PUBLIC_KEY;
```

#### Generate VAPIDs from [Google Firebase](https://firebase.google.com/)
1. Login/Sign up to the [Google Firebase](https://firebase.google.com/)
1. Go to the [console](https://console.firebase.google.com/) and create new project.
1. Go to the Project settings. (Click the settings icon on the right side of the `Project overview` button to see the `Project settings` option)
1. Navigate to the `Cloud Messaging` tab and find the keys from `Web configuration` section.
1. Replace all the demo keys in the code and start working.


## References
- https://developers.google.com/web/fundamentals/codelabs/push-notifications
- https://web-push-codelab.glitch.me/
- https://auth0.com/blog/introduction-to-progressive-web-apps-push-notifications-part-3/   
