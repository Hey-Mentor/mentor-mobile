import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


class PushNotificationService {
    constructor() {
        this.registerForPushNotificationsAsync();        
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
        

        

        return token;
    }

    pushLocalNotification = async(title, body) =>{
        Notifications.presentLocalNotificationAsync({
            title: title,
            body: body,
            data: {
                //token: token,
            },
            ios: {
                sound: true,
            }
          }
      );
    }
    
    scheduleLocalNotification = async(title, body, date) =>{

      if (date <= Date.now()){
        throw new Error('Failed to schedule push notification. Provided value for "date" is before the current date.');
      }
      
      Notifications.scheduleLocalNotificationAsync({
          title: title,
          body: body + "" + date,
          data: {
              //token: token,
          },
          ios: {
              sound: true,
          },
        }
        ,
      {
        time: date.getTime(),
      });
      console.log("Notification scheduled for: " + date);
  }
}



export default PushNotificationService;
