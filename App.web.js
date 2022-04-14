// Import Installed Libraries
import * as React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
// import * as SecureStore from "expo-secure-store";

// Import Screens
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/web/LoginScreen.web";
import SignupScreen from "./src/web/SignupScreen.web";
import ProfileScreen from "./src/web/ProfileScreen.web";
import CreateThesisScreen from "./src/web/CreateThesisScreen.web";
import ThesisDetailScreen from "./src/web/ThesisDetailScreen.web";
import PostDetailScreen from "./src/web/PostDetailScreen.web";
import PortfolioInsightScreen from "./src/web/PortfolioInsightScreen.web";
import SettingsScreen from "./src/screens/SettingsScreen";

// Import Miscellaneous Local Files
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
	// // State Management
	// const { isLoading, hasUserToken } = useSelector((state) => state.authReducer);
	// const dispatch = useDispatch();

	// // Get all of the user's saved theses
	// const getRationaleLibrary = async (userObject) => {
	// 	const retrievedRationales = await RationalesManager.retrieveRationales({
	// 		user_id: userObject.user_id,
	// 	});
	// 	if (retrievedRationales) {
	// 		const rationaleInfo = await RationalesManager.extractRationaleInfo(
	// 			retrievedRationales.records.rationales
	// 		);
	// 		dispatch(refreshLibrary(rationaleInfo));
	// 	}
	// };

	// // Check if the user has a JWT saved on their device and if it's still valid
	// const validateToken = async () => {
	// 	console.log("\nWe got here.\n")
	// 	const user = await UserManager.getUser();
	// 	if (user) {
	// 		// 1. Get user object from secure store
	// 		const userObjectString = await SecureStore.getItemAsync("userObject");
	// 		const userObject = JSON.parse(userObjectString);
	// 		// 2. Get user's raionales to store in universal state
	// 		await getRationaleLibrary(userObject);
	// 		// 3. Get account linkage statues, and store them in universal state
	// 		await LinkAccountsManager.getLinkedAccountsStatus();
	// 		// 4. Store *some* of the user object in universal state
	// 		dispatch(storeUserObject({
	// 			username: userObject.username,
	// 			userId: userObject.user_id,
	// 		}));
	// 	};
	// };

	// React.useEffect(() => {
	// 	validateToken();
	// }, [dispatch]);

	// if (isLoading) {
	// 	return <LoadingScreen />;
	// }

	return (
		<RootStack.Navigator>
			{/* {hasUserToken == false ? (
				// No token found, user isn't logged in
				<RootStack.Screen
					name="AuthStack"
					component={AuthFlow}
					options={{
						headerShown: false,
					}}
				/>
			) : (
				// User is logged in
				<> */}



			{/* <RootStack.Screen
				name="ProfileFlow"
				component={ProfileFlow}
				options={{
					headerShown: false,
				}}
			/> */}


			<RootStack.Screen
				name="PostDetailScreen"
				component={PostDetailScreen}
				options={{
					title: "Pelleum",
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
					headerTitleStyle: { color: TEXT_COLOR },
				}}
			/>


			{/* <RootStack.Screen
				name="ThesisDetailScreen"
				component={ThesisDetailScreen}
				options={{
					title: "Pelleum",
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
					headerTitleStyle: { color: TEXT_COLOR },
				}}
			/> */}


			{/* <RootStack.Screen
				name="PortfolioInsightScreen"
				component={PortfolioInsightScreen}
			/> */}


			{/* </>
			)} */}
		</RootStack.Navigator>
	);
};

export default () => {
	return (
		<Provider store={store}>
			<NavigationContainer theme={DarkTheme}>
				<RootStackFlow />
			</NavigationContainer>
		</Provider>
	);
};
