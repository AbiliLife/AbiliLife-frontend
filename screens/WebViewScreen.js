import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomWebView from '../components/CustomWebView';
import { useSnackbar } from '../context/SnackbarContext';

const WebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { url, title, enableMessaging = false } = route.params;

  const webviewRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const handleMessageFromWebView = useCallback((message) => {
    if (message.type === 'notification') {
      showSnackbar(`Message from WebView: ${message.payload.message}`);
    } else {
      console.warn('Unhandled message type:', message.type);
    }
  }, [showSnackbar]);

  const sendDataToWebView = useCallback(() => {
    const messageData = {
      type: 'greeting',
      payload: {
        message: 'Hello from React Native!',
        sender: 'SuperApp',
      },
    };
    webviewRef.current?.sendMessage(messageData);
  }, []);

  const handleError = useCallback((error) => {
    console.error('WebView loading error:', error);
    showSnackbar('Failed to load the webpage');
  }, [showSnackbar]);

  const reloadWebView = useCallback(() => {
    webviewRef.current?.reload();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <IconButton icon="reload" onPress={reloadWebView} />
          {enableMessaging && (
            <IconButton icon="message-text" onPress={sendDataToWebView} />
          )}
        </View>
      ),
    });
  }, [navigation, reloadWebView, sendDataToWebView, enableMessaging]);

  return (
    <View style={styles.container}>
      <CustomWebView
        ref={webviewRef}
        url={url}
        onMessage={enableMessaging ? handleMessageFromWebView : undefined}
        onError={handleError}
      />
      {enableMessaging && (
        <Button title="Send Message to WebView" onPress={sendDataToWebView} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
});

export default WebViewScreen;
