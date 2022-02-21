# pelleum-frontend

This repository contains the frontend source code for the Pelleum mobile application (iOS and Android).

**Codebase:** JavaScript
**Framework:** React Native
**Workflow:** Expo

## Setup

[React Native Setup Docs](https://reactnative.dev/docs/environment-setup)

1. Set environment variables in `.env` file in project's root directory (get from senior engineer).
2. Install [Node LTS](https://nodejs.org/en/download/).
3. Run `npm install -g expo-cli` to install [Expo CLI](https://docs.expo.dev/) (You must be logged into your machine as root/administrator)    
4. run `npm install` in the project directory to install all dependencies specified in the `package.json` file.
5. To test the application on your mobile device, install the [Expo Go](https://expo.dev/client) app.
6. To test the application on your computer, you will have to use the [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) or the [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).
7. Before running the app for testing, be sure that both [pelleum-api](https://github.com/pelleum/pelleum-api) and [account-connections](https://github.com/pelleum/account-connections) are running locally on your machine (see directions on how to run them in their READMEs.
8. If you are using the Expo Go app, update `REACT_APP_PELLEUM_API_BASE_URL` in the `.env` file with your Wi-Fi network IP (i.e., `192.165.2.4`).
9. If you are using the iOS Simulator or Android Emulator, you can use `localhost` as your base URL.

## Usage

- Run `expo start` or `npm start` in the project's root directory to run the app.
- If you are using the Expo Go app, your mobile device must be connected to the same Wi-Fi network as your computer
- Running the app will generate a QR code, which you can scan with the camera on your mobile device to host the app in the Expo Go app.
- If the app gets stuck on the "Welcome to Pelleum" loading screen, hard code the `baseURL` variable directly (don't use environment variables) in [PelleumAxios.js](./src/api/axios/PelleumAxios.js).

## Useful Terminal Commands
- To open the app on the iOS Simulator, press `i` in your terminal.
- To open the app on the Android Emulator, press `a` in your terminal.
- To open the app on the web, press `w` in your terminal.
- To reload the app, you can press `r` in your terminal (or shake your mobile device if you're using Expo Go).
- To show all Expo commands, press `?` in your terminal.

## Major Libraries Used
[react-navigation](https://reactnavigation.org/docs/getting-started)
- Allows us to implement the app's navigation functionality.
- The pelleum-frontend is using **react-navigation v6**.
[axios](https://github.com/axios/axios)
- A promise-based HTTP Client for node.js and the browser (same codebase).
- We use this to make network requests to APIs.
[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- Provides a way **encrypt** and securely store key–value pairs locally on the device.
[async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- Provides a way to store **unencrypted** key–value pairs locally on the device.
[segment/analytics-react-native](https://github.com/segmentio/analytics-react-native#readme)
- Allows us to track how our users interact with the Pelleum app.
[expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- Provides access to the system's web browser and supports handling redirects.
[expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- Allows us to provide haptic feedback when a user performs certain actions in the Pelleum app.
[expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- Provides a way to create linear color gradients.
[native-base](https://docs.nativebase.io/)
- A library that offers out-of-the-box components.
- This can be useful if you don't want to build custom components from scratch (using primitive React Native components).
[dotenv](https://github.com/motdotla/dotenv)
- Provides a way to store sensitive information in environment variables.
[redux](https://github.com/reduxjs/redux)
- Allows us to manage some state variables globally.
