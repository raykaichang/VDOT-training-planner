package tw.runstrategy.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.MimeTypeMap;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

public final class MainActivity extends Activity {
    private static final int LOCATION_PERMISSION_REQUEST = 1001;
    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String APP_ROOT = "https://" + APP_HOST + "/assets/";

    private WebView webView;
    private String pendingGeolocationOrigin;
    private GeolocationPermissions.Callback pendingGeolocationCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.web_view);
        applySystemBarInsets(findViewById(R.id.root_container), webView);
        configureWebView(webView);

        if (savedInstanceState == null || webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(APP_ROOT + "index.html");
        }
    }

    @SuppressWarnings("deprecation")
    private void applySystemBarInsets(View root, WebView content) {
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            FrameLayout.LayoutParams params =
                    (FrameLayout.LayoutParams) content.getLayoutParams();
            int left = insets.getSystemWindowInsetLeft();
            int top = insets.getSystemWindowInsetTop();
            int right = insets.getSystemWindowInsetRight();
            int bottom = insets.getSystemWindowInsetBottom();

            if (
                    params.leftMargin != left
                            || params.topMargin != top
                            || params.rightMargin != right
                            || params.bottomMargin != bottom
            ) {
                params.setMargins(left, top, right, bottom);
                content.setLayoutParams(params);
            }

            return insets;
        });
        root.requestApplyInsets();
    }

    @SuppressWarnings("SetJavaScriptEnabled")
    private void configureWebView(WebView view) {
        view.setBackgroundColor(Color.rgb(238, 243, 241));
        view.setWebViewClient(new LocalAssetWebViewClient());
        view.setWebChromeClient(new AppWebChromeClient());

        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != LOCATION_PERMISSION_REQUEST || pendingGeolocationCallback == null) {
            return;
        }

        boolean granted = false;
        for (int result : grantResults) {
            granted |= result == PackageManager.PERMISSION_GRANTED;
        }

        pendingGeolocationCallback.invoke(pendingGeolocationOrigin, granted, false);
        pendingGeolocationOrigin = null;
        pendingGeolocationCallback = null;
    }

    private boolean hasLocationPermission() {
        return checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED
                || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void openExternalUri(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
            // Keep the embedded app usable when no handler exists for the URL.
        }
    }

    private final class AppWebChromeClient extends WebChromeClient {
        @Override
        public void onGeolocationPermissionsShowPrompt(
                String origin,
                GeolocationPermissions.Callback callback
        ) {
            if (!origin.startsWith("https://" + APP_HOST)) {
                callback.invoke(origin, false, false);
                return;
            }

            if (hasLocationPermission()) {
                callback.invoke(origin, true, false);
                return;
            }

            pendingGeolocationOrigin = origin;
            pendingGeolocationCallback = callback;
            requestPermissions(
                    new String[] {
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    LOCATION_PERMISSION_REQUEST
            );
        }
    }

    private final class LocalAssetWebViewClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(
                WebView view,
                WebResourceRequest request
        ) {
            return loadLocalAsset(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation")
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            return loadLocalAsset(Uri.parse(url));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation")
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleNavigation(Uri.parse(url));
        }

        private boolean handleNavigation(Uri uri) {
            if ("https".equalsIgnoreCase(uri.getScheme()) && APP_HOST.equals(uri.getHost())) {
                return false;
            }
            openExternalUri(uri);
            return true;
        }

        private WebResourceResponse loadLocalAsset(Uri uri) {
            if (!"https".equalsIgnoreCase(uri.getScheme()) || !APP_HOST.equals(uri.getHost())) {
                return null;
            }

            String path = uri.getPath();
            if (path == null || !path.startsWith("/assets/")) {
                return null;
            }

            String assetPath = path.substring("/assets/".length());
            if (assetPath.isEmpty() || assetPath.endsWith("/")) {
                assetPath += "index.html";
            }
            if (assetPath.contains("..")) {
                return null;
            }

            try {
                InputStream input = getAssets().open(assetPath);
                return new WebResourceResponse(mimeTypeFor(assetPath), "UTF-8", input);
            } catch (IOException ignored) {
                return null;
            }
        }

        private String mimeTypeFor(String assetPath) {
            String extension = MimeTypeMap.getFileExtensionFromUrl(assetPath);
            String mimeType = MimeTypeMap.getSingleton()
                    .getMimeTypeFromExtension(extension.toLowerCase(Locale.ROOT));
            if (mimeType != null) {
                return mimeType;
            }
            if (assetPath.endsWith(".mjs")) {
                return "text/javascript";
            }
            return "application/octet-stream";
        }
    }
}
