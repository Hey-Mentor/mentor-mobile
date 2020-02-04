import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';

const MessageBox = ({
  title, text, imageSource, visible
}) => {
  if (visible) {
    return (
      <View style={styles.contentWrap}>
        {/* Textbox */}
        <View style={styles.messageBox}>
          <Text style={styles.messageBoxTitleText}>{title}</Text>
          <Text style={styles.messageBoxText}>
            {text}
          </Text>
        </View>
        <View style={styles.imageBox}>
          <Image style={styles.imageBoxImage} source={imageSource} />
        </View>
      </View>
    );
  }
  return (null);
};

const styles = StyleSheet.create({
  contentWrap: {
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: '#d9f0f9',
    borderRadius: 8,
    padding: 10,
    margin: 20,
    width: '90%'
  },
  messageBoxTitleText: {
    fontSize: 20,
    color: '#222222',
    alignItems: 'center',
    textAlign: 'center'
  },
  messageBoxText: {
    color: '#222222',
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
  },
  imageBoxImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 350,
    marginTop: 50,
  },
});

export default MessageBox;
