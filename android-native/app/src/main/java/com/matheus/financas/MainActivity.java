package com.matheus.financas;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;

public class MainActivity extends Activity {
    private WebView webView;
    private boolean pageReady;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.parseColor("#060A19"));
        getWindow().setNavigationBarColor(Color.parseColor("#03050D"));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(0);
        }

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(true);

        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        NativeEventStore.setListener(() -> runOnUiThread(this::flushPendingEvents));
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidFinance");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
                flushPendingEvents();
            }
        });

        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onDestroy() {
        NativeEventStore.setListener(null);
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    @Override
    protected void onResume() {
        super.onResume();
        flushPendingEvents();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    private void flushPendingEvents() {
        if (!pageReady || webView == null) return;
        JSONArray events = NativeEventStore.consume(this);
        for (int i = 0; i < events.length(); i += 1) {
            String script = "window.FinanceNativeBridge && "
                    + "window.FinanceNativeBridge.receiveFinancialEvent("
                    + events.optJSONObject(i)
                    + ");";
            webView.evaluateJavascript(script, null);
        }
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void openNotificationSettings() {
            runOnUiThread(() -> {
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                startActivity(intent);
            });
        }

        @JavascriptInterface
        public boolean isNotificationAccessEnabled() {
            String listeners = Settings.Secure.getString(
                    getContentResolver(),
                    "enabled_notification_listeners"
            );
            return !TextUtils.isEmpty(listeners)
                    && listeners.toLowerCase().contains(getPackageName().toLowerCase());
        }
    }
}
