package com.matheus.financas;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

final class NativeEventStore {
    private static final String PREFS = "native_finance_events";
    private static final String KEY_EVENTS = "events";
    private static Runnable listener;

    private NativeEventStore() {
    }

    static synchronized void enqueue(Context context, JSONObject event) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            JSONArray events = new JSONArray(prefs.getString(KEY_EVENTS, "[]"));
            events.put(event);
            prefs.edit().putString(KEY_EVENTS, events.toString()).apply();
            if (listener != null) listener.run();
        } catch (Exception ignored) {
        }
    }

    static synchronized void setListener(Runnable callback) {
        listener = callback;
    }

    static synchronized JSONArray consume(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        try {
            JSONArray events = new JSONArray(prefs.getString(KEY_EVENTS, "[]"));
            prefs.edit().putString(KEY_EVENTS, "[]").apply();
            return events;
        } catch (Exception ignored) {
            prefs.edit().putString(KEY_EVENTS, "[]").apply();
            return new JSONArray();
        }
    }
}
