# PELLEUM FRONTEND

## LOCAL DEVELOPEMENT INSTRUCTIONS
- Set environment variables in .env file (get from senior engineer)
- `sudo npm install -g expo-cli`
- `npm install`
- Make sure account connections and pelleum api are both running

## Test with physical device
- download Expo Go app
- update `REACT_APP_ACCOUNT_CONNECTIONS_BASE_URL` env variable with local wifi address
- update `REACT_APP_PELLEUM_API_BASE_URL` env variable with local wifi address
- `expo start`
- if app won't load properly - set `baseURL` variable directly (don't use env variables) in this [file](./src/api/axios/AccountConnectAxios.js) and this [file](./src/api/axios/PelleumAxios.js)
- press `r` to reload app

## Test with iOS emulator
- download XCode

## Test with Android emulator
- download Android Studio
- use AVD manager to setup an emulator