// components/CustomWebView.js
import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const CustomWebView = forwardRef(({ 
  url, 
  onMessage, 
  style,
  loadingColor = "#00ff00",
  onLoadStart,
  onLoadEnd,
  onError,
}, ref) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const sendMessageScript = (jsonData) => `
    (function() {
      try {
        window.postMessage(${JSON.stringify(jsonData)}, '*');
      } catch (error) {
        console.error("WebView: Failed to post message", error);
      }
      return true;
    })();
  `;

  useImperativeHandle(ref, () => ({
    sendMessage: (messageData) => {
      try {
        const jsonData = JSON.stringify(messageData);
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(sendMessageScript(jsonData));
        }
      } catch (error) {
        console.error('Failed to stringify message data:', error);
        Alert.alert(
          'Error',
          'An error occurred while preparing the message for WebView.'
        );
      }
    },
    reload: () => {
      webViewRef.current?.reload();
    },
    goBack: () => {
      webViewRef.current?.goBack();
    },
    goForward: () => {
      webViewRef.current?.goForward();
    }
  }));

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (typeof message !== 'object' || message === null) {
        throw new Error('Message is not a valid object');
      }
      onMessage?.(message);
    } catch (error) {
      console.error('Failed to parse JSON from WebView:', error);
      Alert.alert(
        'Communication Error',
        'An error occurred while processing a message from the WebView.'
      );
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadEnd?.();
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError?.(nativeEvent);
    Alert.alert(
      'Loading Error',
      'Failed to load the webpage. Please check your connection and try again.'
    );
  };

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={loadingColor} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onMessage={handleMessage}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
});

export default CustomWebView;