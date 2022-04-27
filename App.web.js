// Import Installed Libraries
import * as React from "react";
import { Image } from 'react-native';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { navigationRef } from './src/nav/RootNavigation';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import * as Linking from 'expo-linking';

// Import Screens
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/web/LoginScreen.web";
import SignupScreen from "./src/web/SignupScreen.web";
import ProfileScreen from "./src/web/ProfileScreen.web";
import CreateThesisScreen from "./src/web/CreateThesisScreen.web";
import ThesisDetailScreen from "./src/web/ThesisDetailScreen.web";
import PostDetailScreen from "./src/web/PostDetailScreen.web";
import PortfolioInsightScreen from "./src/screens/PortfolioInsightScreen";
import RationaleScreen from "./src/web/RationaleScreen.web";
import SettingsScreen from "./src/screens/SettingsScreen";
import NotFoundScreen from "./src/screens/NotFoundScreen";

// Import Miscellaneous Local Files
import LocalStorage from "./src/storage/LocalStorage";
import BackButton from "./src/components/BackButton";
import RationalesManager from "./src/managers/RationalesManager";
import UserManager from "./src/managers/UserManager";
import LinkAccountsManager from "./src/managers/LinkAccountsManager";
import { MAIN_BACKGROUND_COLOR, MAIN_SECONDARY_COLOR, TEXT_COLOR } from "./src/styles/Colors";

// Redux
import { Provider } from "react-redux";
import { store } from "./src/redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { refreshLibrary } from "./src/redux/actions/RationaleActions";
import { storeUserObject } from "./src/redux/actions/AuthActions";

// Authentication Flow
const AuthStack = createNativeStackNavigator();
const AuthFlow = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen
			name="LoginScreen"
			component={LoginScreen}
			options={{ headerShown: false }}
		/>
		<AuthStack.Screen
			name="SignupScreen"
			component={SignupScreen}
			options={{ headerShown: false }}
		/>
	</AuthStack.Navigator>
);

// Profile Flow
const ProfileStack = createNativeStackNavigator();
const ProfileFlow = () => (
	<ProfileStack.Navigator
		initialRouteName="ProfileScreen"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<ProfileStack.Screen
			name="ProfileScreen"
			component={ProfileScreen}
			options={{ headerShown: false }}
		/>
		<ProfileStack.Screen
			name="SettingsScreen"
			component={SettingsScreen}
			options={{
				title: "Settings",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
				gestureEnabled: false,
				headerLeft: () => <BackButton />
			}}
		/>
		<ProfileStack.Screen
			name="CreateThesisScreen"
			component={CreateThesisScreen}
			options={{
				title: "Write a Thesis",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
				gestureEnabled: false,
				headerLeft: () => <BackButton />
			}}
		/>
	</ProfileStack.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackFlow = () => {
	// State Management
	const { isLoading, hasUserToken } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();

	// Get all of the user's saved theses
	const getRationaleLibrary = async (userObject) => {
		const retrievedRationales = await RationalesManager.retrieveRationales({
			user_id: userObject.user_id,
		});
		if (retrievedRationales) {
			const rationaleInfo = await RationalesManager.extractRationaleInfo(
				retrievedRationales.records.rationales
			);
			dispatch(refreshLibrary(rationaleInfo));
		}
	};

	// Check if the user has a JWT saved on their device and if it's still valid
	const validateToken = async () => {
		const user = await UserManager.getUser();
		if (user) {
			// 1. Get user object from secure store
			const userObjectString = await LocalStorage.getItem("userObject");
			const userObject = JSON.parse(userObjectString);
			// 2. Get user's raionales to store in universal state
			await getRationaleLibrary(userObject);
			// 3. Get account linkage statues, and store them in universal state
			await LinkAccountsManager.getLinkedAccountsStatus();
			// 4. Store *some* of the user object in universal state
			dispatch(storeUserObject({
				username: userObject.username,
				userId: userObject.user_id,
			}));
		};
	};

	React.useEffect(() => {
		validateToken();
	}, [dispatch]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<RootStack.Navigator>
			{hasUserToken == false ? (
				// No token found, user isn't logged in
				<>
					<RootStack.Screen
						name="AuthStack"
						component={AuthFlow}
						options={{
							headerShown: false,
						}}
					/>
					<RootStack.Screen
						name="PostDetailScreen"
						component={PostDetailScreen}
						options={{
							headerTitle: () => (
								<Image style={{ width: 35, height: 35, marginBottom: 5, }} source={require("./assets/transparent-bg-logo.png")} />
							),
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="ThesisDetailScreen"
						component={ThesisDetailScreen}
						options={{
							headerTitle: () => (
								<Image style={{ width: 35, height: 35, marginBottom: 5, }} source={require("./assets/transparent-bg-logo.png")} />
							),
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="PortfolioInsightScreen"
						component={PortfolioInsightScreen}
					/>
					<RootStack.Screen
						name="RationaleScreen"
						component={RationaleScreen}
						options={{
							title: "Rationale Library",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="NotFoundScreen"
						component={NotFoundScreen}
					/>
				</>
			) : (
				// User is logged in
				<>
					<RootStack.Screen
						name="ProfileFlow"
						component={ProfileFlow}
						options={{
							headerShown: false,
						}}
					/>
					<RootStack.Screen
						name="PostDetailScreen"
						component={PostDetailScreen}
						options={{
							headerTitle: () => (
								<Image style={{ width: 35, height: 35, marginBottom: 5, }} source={require("./assets/transparent-bg-logo.png")} />
							),
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="ThesisDetailScreen"
						component={ThesisDetailScreen}
						options={{
							headerTitle: () => (
								<Image style={{ width: 35, height: 35, marginBottom: 5, }} source={require("./assets/transparent-bg-logo.png")} />
							),
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="PortfolioInsightScreen"
						component={PortfolioInsightScreen}
					/>
					<RootStack.Screen
						name="RationaleScreen"
						component={RationaleScreen}
						options={{
							title: "Rationale Library",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="NotFoundScreen"
						component={NotFoundScreen}
					/>
				</>
			)}
		</RootStack.Navigator>
	);
};

export default () => {
	const config = {
		screens: {
			AppFlow: {
				screens: {
					ProfileFlow: {
						screens: {
							ProfileScreen: "profile"
						}
					},
				},
			},
			CreateThesisScreen: 'thesis/create',
			PostDetailScreen: 'post/:postId',
			ThesisDetailScreen: 'thesis/:thesisId',
			PortfolioInsightScreen: 'profile/:userId',
			// NotFoundScreen: "*" // we need to create and import this screen
		},
	};

	// Need to set up prefix as environment variable
	//if (__DEV__){ prefix = "com.pelleum.dev://app" }
	//if (preview){ prefix = "com.pelleum.preview://app" }
	//if (prod){ prefix = "com.pelleum.mobile://app" }
	//if the scheme is defined as "pelleum", we may just need to do "pelleum://"
	const linking = {
		prefixes: [Linking.createURL('/'), 'com.pelleum.dev://app'],
		config: config,
	};
	return (
		<Provider store={store}>
			<NavigationContainer ref={navigationRef} linking={linking} fallback={<LoadingScreen />} theme={DarkTheme}>
				<RootStackFlow />
			</NavigationContainer>
		</Provider>
	);
};
