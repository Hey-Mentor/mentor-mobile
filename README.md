# Hey Mentor Mobile Application 

## Overview 

This project contains the Hey Mentor mobile application built with React Native.

For more on the Hey Mentor organization, including how you can get involved, please visit [heymentor.org](https://www.heymentor.org/). 

## Mobile Application 

This mobile application is used by the Hey Mentor organization to facilitate communication between mentors and mentees. 

## Running the Prototype 

1. Download or clone GitHub repository 

In the directory you want to clone the repo to, run: 

	git clone https://github.com/Hey-Mentor/mentor-mobile.git


2. Download and install the EXPO development environment (XDE) on your desktop. Follow [this guide](https://docs.expo.io/versions/latest/introduction/installation) for detailed instructions. 


3. Download and install the [EXPO mobile client](https://expo.io/tools#client) on your phone 


4. From XDE, choose "Open Project", and locate the directory where you cloned the GitHub project to. Be sure to navigate to the `web` folder 


5. If this is the first time executing the project, you will need to navigate to the web folder in a terminal and execute: 

`npm install`


6. Once the project is open, you can select "Share" from the top right corner. This will present a QR code which you can scan with the EXPO app on your device 


## Signing In 

By default, only developers can access the signed-in portion of the application (behind the Facebook login). To get registered as a developer, please contact the project owner. 

Additionally, if you wish to skip the login portion of the app, you can checkout the test branch: 

`testSkipAuth`