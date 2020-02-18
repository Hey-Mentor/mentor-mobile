# Hey Mentor Mobile Application 

## Overview 

This project contains the Hey Mentor mobile application built with React Native.

For more on the Hey Mentor organization, including how you can get involved, please visit [heymentor.org](https://www.heymentor.org/). 

## Mobile Application 

This mobile application is used by the Hey Mentor organization to facilitate communication between mentors and mentees. 

## UI Mock Up 

The latest UI design can be found [here](https://www.figma.com/file/2TOYmQtfx3HTq11em2wZ81/Hey-Mentor---vNext?node-id=0%3A1)

## Running the Prototype 

1. Download or clone GitHub repository 

In the directory you want to clone the repo to, run: 

	git clone https://github.com/Hey-Mentor/mentor-mobile.git


2. Download and install the EXPO CLI on your desktop. Follow [this guide](https://docs.expo.io/versions/v35.0.0/get-started/installation/) for detailed instructions. 


3. Download and install the [EXPO mobile client](https://expo.io/tools#client) on your phone (or you can use an iOS simulator through Xcode or Android simulator through Android Studio)


4. [First time only]: If this is the first time executing the project, you will need to execute: 

`yarn install`

5. Add `config.js` which should contain the env vars. 
**Note:** If you're using a local dev env, make sure that `API_URL` and `API_TEST_URL` are pointing to your machine's IP address rather than 127.0.0.1 or localhost as 127.0.0.1/localhost will point the mobile phone to itself

6. Execute: 

`expo start` 

## Signing In 

By default, only developers can access the signed-in portion of the application (behind the Facebook login). To get registered as a developer, or to get credentials for a test user, please contact the project owner. 

## FAQ
* Why is the API returning a 401 - Unauthorized?  
	* This response may occur when the API request contains an invalid token/api_key. 
	* Sometimes the app will not build correctly and therefore use an outdated token value. If logging in and out of the account does not work, try clearing the cache and data of the expo app.
	
## Useful Links
* [Trello Board - Mobile App](https://trello.com/b/6ygtAMTp/mobile-app)\
* [Encryption Design Doc](https://docs.google.com/document/d/12fLR2L9h6mdFVJjiD0fcWwch2_yA1uKMoZDNhgiDPas/edit)\
* [vNext UI Mockups](https://www.figma.com/file/2TOYmQtfx3HTq11em2wZ81/Hey-Mentor---vNext?node-id=1922%3A101)

