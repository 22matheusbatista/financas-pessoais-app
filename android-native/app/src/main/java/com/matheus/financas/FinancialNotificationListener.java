package com.matheus.financas;

import android.app.Notification;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import org.json.JSONObject;

public class FinancialNotificationListener extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification notification) {
        Notification androidNotification = notification.getNotification();
        if (androidNotification == null) return;

        Bundle extras = androidNotification.extras;
        if (extras == null) return;

        String title = charSequenceToString(extras.getCharSequence(Notification.EXTRA_TITLE));
        String text = charSequenceToString(extras.getCharSequence(Notification.EXTRA_TEXT));
        String bigText = charSequenceToString(extras.getCharSequence(Notification.EXTRA_BIG_TEXT));
        String fullMessage = (title + " " + text + " " + bigText).trim();

        JSONObject event = FinancialNotificationParser.parse(
                notification.getPackageName(),
                title,
                fullMessage,
                notification.getPostTime()
        );

        if (event != null) {
            NativeEventStore.enqueue(getApplicationContext(), event);
        }
    }

    private String charSequenceToString(CharSequence value) {
        return value == null ? "" : value.toString();
    }
}
