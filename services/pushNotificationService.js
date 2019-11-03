import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


class PushNotificationService {
    constructor(title, message) {
        console.log('Startig the push notification service ...');

        //
        this.registerForPushNotificationsAsync();
        console.log('Title: ' + title + " Message: " + message)
    }





    registerForPushNotificationsAsync = async() =>{
        
        /**
         * If it does not return a token during testing make sure to:
         
            - Use 'expo start'
            - Log into expo on the cli
            - Clear cache 
                  
          */ 

        //Check Permission
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
      
        //Ask for permission
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
      
        //The user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
      
        console.log('Token for push notification: ', token);
        

        //Local test notification
        Notifications.presentLocalNotificationAsync({
            title: 'Local Notification',
            body: 'The token is: ' + token,
            data: {
                token: token,
            },
            ios: {
                sound: true,
            },
          });

        return token;
    }
}



export default PushNotificationService;
