import React from 'react';
import PropTypes from 'prop-types';
import {
    Text, 
    View, 
    StyleSheet,
    Image
} from 'react-native';



const MessageBox = ({title, text, imageSource, visible}) => {
    if (visible){
      return(
      
        <View style = {styles.contentWrap}>
            {/* Textbox */}
            <View style={styles.messageBox}>
              <Text style={styles.messageBoxTitleText}>{title}</Text>
              <Text style={styles.messageBoxText}>
                {text}
              </Text>
            </View>

            <View style={styles.imageBox}>
              <Image style={styles.imageBoxImage} source={imageSource}/>
            </View>
        </View>
      );
    }

    else{
      return null;
    }
    
}


MessageBox.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    visible: PropTypes.bool
};


const styles = StyleSheet.create({
    contentWrap: {
        alignItems:"center",
    },
    messageBox: {
        backgroundColor: "#ef553a", //Red
        borderRadius: 8,
        padding:10,
        margin: 20,
        width: '90%'
      },
    
      //Second
      messageBoxTitleText: {
        fontSize:20,
        color: '#fff',
        fontWeight:'bold',
    
        alignItems: 'center',
        textAlign: 'center'
      },
    
      messageBoxText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    
        margin:10,
        textAlign:'center',
      },
    
      imageBox: {
    
      },
    
      imageBoxImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 180,
        height: 350,
        marginTop: 50,
      },
})


export {MessageBox};