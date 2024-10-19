import React, { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const WebViewScreen = ({ route }) => {
  const { url } = route.params;
  const webViewRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => setLoading(false);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <WebView
       ref={webViewRef}
       source={{ uri: url }} 
       style={styles.webview}
       onLoadEnd={onLoadEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;