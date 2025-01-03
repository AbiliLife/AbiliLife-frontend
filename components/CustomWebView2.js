// components/CustomWebView.js
import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from 'react-native-paper';

const CustomWebView = forwardRef(({
  url,
  onMessage,
  style,
  onLoadStart,
  onLoadEnd,
  onError,
  injectedJavaScript,
  ...props
}, ref) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const theme = useTheme();

  const baseInjectedJavaScript = `
    window.ReactNativeWebView.onMessage = function(data) {
      try {
        const parsedData = JSON.parse(data);
        window.dispatchEvent(new CustomEvent('ReactNativeMessage', { detail: parsedData }));
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    true;
  `;

  useImperativeHandle(ref, () => ({
    sendMessage: (messageData) => {
      try {
        const jsonData = JSON.stringify(messageData);
        webViewRef.current?.injectJavaScript(`
          (function() {
            window.dispatchEvent(new CustomEvent('ReactNativeMessage', { 
              detail: ${jsonData}
            }));
            return true;
          })();
        `);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    reload: () => webViewRef.current?.reload(),
    goBack: () => webViewRef.current?.goBack(),
    goForward: () => webViewRef.current?.goForward(),
    canGoBack: () => canGoBack
  }));

  const handleNavigationStateChange = useCallback((navState) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onMessage={onMessage}
        onLoadStart={() => {
          setLoading(true);
          onLoadStart?.();
        }}
        onLoadEnd={() => {
          setLoading(false);
          onLoadEnd?.();
        }}
        onError={onError}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScript={`
          ${baseInjectedJavaScript}
          ${injectedJavaScript || ''}
        `}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default CustomWebView;