# Pelleum Frontend
This repository contains the frontend source code for the Pelleum mobile application (iOS and Android).

**Codebase:** JavaScript  
**Framework:** React Native  
**Workflow:** Expo

## Setup
[React Native Setup Docs](https://reactnative.dev/docs/environment-setup)
1. Create `.env.development` and `.env.production` files in the project's root directory and set all environment variables (get from senior engineer). Refer to [this document](https://docs.expo.dev/workflow/development-mode/) to understand the difference between Development and Production Mode for an Expo-managed React Native application.
2. Install [Node LTS](https://nodejs.org/en/download/).
3. Run `npm install -g expo-cli` to install [Expo CLI](https://docs.expo.dev/) (You must be logged into your machine as root/administrator).
4. Run `npm install -g eas-cli` to install [EAS CLI](https://docs.expo.dev/build/setup/) (You must be logged into your machine as root/administrator).
5. Run `npm install` in the project directory to install all dependencies specified in the `package.json` file.
6. To test the application on your mobile device, install the [Expo Go](https://expo.dev/client) app. Additional configuration will be required for [full project builds that contain native code](#testing-full-builds-with-native-code).
7. To test the application on your computer, you will have to use the [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) or the [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) **(this will not work for full project builds that contain native code)**.
8. Before running the app for testing, be sure that both [pelleum-api](https://github.com/pelleum/pelleum-api) and [account-connections](https://github.com/pelleum/account-connections) are running locally on your machine (see directions on how to run them in their READMEs.
9.  If you are using a mobile device, update `PELLEUM_API_BASE_URL` in the `.env.development` file with your Wi-Fi network IP (i.e., `192.165.2.4`).
10. If you are using the iOS Simulator or Android Emulator, you can use `localhost` as your base URL.

## Usage
Since the Pelleum mobile application contains some native code, the vast majority of testing will require creating full builds and running them in a custom development client. In cases where you have a separate React Native test project that does not contain native code, basic testing will suffice.
### Adding Native Modules
Refer to the Expo [Config Plugins](https://docs.expo.dev/guides/config-plugins/) docs.

### Basic Testing
- Run `expo start` or `npm start` in the project's root directory to run the app.
- If you are using the Expo Go app, your mobile device must be connected to the same Wi-Fi network as your computer.
- Running the app will generate a QR code, which you can scan with the camera on your mobile device to host the app in the Expo Go app.

### Testing Full Builds with Native Code
This is the primary way we will conduct testing of the Pelleum mobile application, since the Expo Go app does not have any native modules installed by default. You must have an existing [Expo](https://expo.dev/) account that you can log into when creating app builds (if prompted). You will also need the Pelleum Apple Developer login credentials if you are creating an iOS build. At present, it takes around 10 minutes for a build to complete. You can keep track of your builds in your [Expo Dashboard](https://expo.dev/).
 - To create a development build for both Android and iOS at the same time, run `eas build --profile development --platform all` in the project's root directory.
 - To create a development build for all Android, run `eas build --profile development --platform android` in the project's root directory.
 - To create a development build for all iOS, run `eas build --profile development --platform ios` in the project's root directory.
 - Once the build completes, a QR code will be generated for each platform. Scan this QR code to download and install the custom development client onto your mobile device.
 - To run the client, run `expo start --dev-client` in the project's root directory. This will generate a QR code that you can scan to start the app on the custom development client you just installed on your mobile device.

**Note:** You only have to create a new build if you modified or added any native modules. Otherwise, you can simply run `expo start --dev-client` and continue to use the same client.

## Creating Builds with EAS CLI
- We can specify the profile we want to build (defined in eas.json), such as `eas build --profile development -p all`
- If we don't specify  a profile, **the build will default to production!**
- The `preview` profile allows us to test out the app in production-like circumstances. The main difference between `preview` and `production` is that `preview` builds are not signed for distribution to stores.

## Updates
- To publish an "over-the-air" (OTA) update, run the following command along with any secret values: `<secrets> expo publish`
- See the last 100 items in publish history: `expo publish:history --count 100`
- See publishing history for ios: `expo publish:history --p ios`
- See publishing history for android: `expo publish:history --p android`
- See more details of a specific publish: `expo publish:details --publish-id <publish id>`
- Rollback a release channel entry (only one platform at a time): `expo publish:set -c <channel name> --publish-id <publish id>`

## Submit App Build to App Store with EAS CLI
- Submit the latest iOS build to Apple: `eas submit -p ios --latest`
- Submit the latest Android build to Google: `eas submit -p android --latest`

## Useful Terminal Commands
**Note:** The app must be running for these commands to work.
- To open the app on the iOS Simulator, press `i` in your terminal.
- To open the app on the Android Emulator, press `a` in your terminal.
- To open the app on the web, press `w` in your terminal.
- To reload the app, you can press `r` in your terminal (or shake your mobile device if you're using Expo Go).
- To show all Expo commands, press `?` in your terminal.

## Major Libraries Used
- [react-navigation](https://reactnavigation.org/docs/getting-started): Allows us to implement the app's navigation functionality (currently using **react-navigation v6**).
- [axios](https://github.com/axios/axios): A promise-based HTTP Client for node.js and the browser (same codebase). We use this to make network requests to APIs.
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/): Provides a way **encrypt** and securely store key–value pairs locally on the device.
- [eas-cli](https://docs.expo.dev/build/setup/): Allows us to create full builds of Expo-managed React Native apps that contain native code. Refer to [this video](https://www.youtube.com/watch?v=id0Im72UN6w&ab_channel=Expo) for a detailed explanation.
- [expo-dev-client](https://docs.expo.dev/development/getting-started/): Allows us to run and test full builds of Expo-managed React Native apps that contain native code. Refer to [this video](https://www.youtube.com/watch?v=Iw8FAUftJFU&ab_channel=eveningkid) for a detailed explanation.
- [async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/): Provides a way to store **unencrypted** key–value pairs locally on the device.
- [segment/analytics-react-native](https://github.com/segmentio/analytics-react-native#readme): Allows us to track how our users interact with the Pelleum app.
- [expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/): Provides access to the system's web browser and supports handling redirects.
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/): Allows us to provide haptic feedback when a user performs certain actions in the Pelleum app.
- [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/): Provides a way to create linear color gradients.
- [native-base](https://docs.nativebase.io/): A library that offers out-of-the-box components. This can be useful if you don't want to build custom components from scratch (using primitive React Native components).
- [dotenv](https://github.com/motdotla/dotenv): Provides a way to store sensitive information in environment variables. Since we use a [babel.config.js](/babel.config.js) file, we also need [babel-plugin-inline-dotenv](https://github.com/brysgo/babel-plugin-inline-dotenv#readme). For more info, refer to the [Expo docs](https://docs.expo.dev/guides/environment-variables/).
- [redux](https://github.com/reduxjs/redux): Allows us to manage some state variables globally.
- [expo/vector-icons](https://docs.expo.dev/guides/icons/): An icon library included with Expo. To browse all icons, you can use [icons.expo.fyi](https://icons.expo.fyi/) or [oblador](https://oblador.github.io/react-native-vector-icons/).