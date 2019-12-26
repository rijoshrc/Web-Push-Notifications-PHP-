<?php
require 'vendor/autoload.php';

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

/**
 * Handle post request
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // convert the string to subscription object
        $subscription = Subscription::create(json_decode($_POST['subscription'], true));
        $auth = array(
            'VAPID' => array(
                'subject' => 'http://localhost:8887/',
                'publicKey' => 'BOwAikTNwh3JmmrXz7DHsclNkD8xlviX30LdCdrBFmpVI6bDVncfQFaBuR0J2UKishaQ-XldL_5cwxCYevRbq_I',
                'privateKey' => 'cpLoIRmfriSyghLk9NmImwK_YT3JOU5LxnuDJyP_kqI',
            ),
        );
        // initialize the push service with VAPID
        $webPush = new WebPush($auth);
        // send notification
        $webPush->sendNotification($subscription, "Hey there");
        // flush the push
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            if ($report->isSuccess()) {
                echo "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
            }
        }
    } catch (\Exception $exception) {
        echo $exception->getMessage();
    }
}