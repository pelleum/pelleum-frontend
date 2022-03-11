// Import Installed Libraries
import 'expo-dev-client';
import * as React from "react";
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { createClient, AnalyticsProvider } from '@segment/analytics-react-native';

// Local Files
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ThesisDetailScreen from "./src/screens/ThesisDetailScreen";
import SearchScreen from "./src/screens/SearchScreen";
import EdScreen from "./src/screens/EdScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PortfolioInsightScreen from "./src/screens/PortfolioInsightScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import CreateThesisScreen from "./src/screens/CreateThesisScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import LinkAccount from "./src/screens/LinkAccount";
import LinkedAccountsStatus from "./src/screens/LinkedAccountsStatus";
import RationaleScreen from "./src/screens/RationaleScreen";
import AuthoredThesesScreen from "./src/screens/AuthoredThesesScreen";
import AuthoredPostsScreen from "./src/screens/AuthoredPostsScreen";
import DataPrivacyScreen from './src/screens/DataPrivacyScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import RationalesManager from "./src/managers/RationalesManager";
import UserManager from "./src/managers/UserManager";
import LinkAccountsManager from "./src/managers/LinkAccountsManager";
import { LIGHT_GREY_COLOR, MAIN_BACKGROUND_COLOR, MAIN_SECONDARY_COLOR, TEXT_COLOR } from "./src/styles/Colors";
import BackButton from './src/components/BackButton';

// Redux
import { Provider } from "react-redux";
import { store } from "./src/redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { refreshLibrary } from "./src/redux/actions/RationaleActions";
import { storeUserObject } from "./src/redux/actions/AuthActions";

// Segment client
const segmentClient = createClient({
	writeKey: process.env.WRITE_KEY,
	trackAppLifecycleEvents: true,
});

// Authentication Flow
const AuthStack = createNativeStackNavigator();
const AuthFlow = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen
			name="Login"
			component={LoginScreen}
			options={{ headerShown: false }}
		/>
		<AuthStack.Screen
			name="SignUp"
			component={SignupScreen}
			options={{ headerShown: false }}
		/>
	</AuthStack.Navigator>
);

// Feed Flow
const FeedStack = createNativeStackNavigator();
const FeedFlow = () => (
	<FeedStack.Navigator
		initialRouteName="Feed"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<FeedStack.Screen
			name="Feed"
			component={FeedScreen}
			options={{ headerShown: false }}
		/>
	</FeedStack.Navigator>
);

// Search Flow
const SearchStack = createNativeStackNavigator();
const SearchFlow = () => (
	<SearchStack.Navigator
		initialRouteName="Search"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<SearchStack.Screen
			name="Search"
			component={SearchScreen}
			options={{ headerShown: false }}
		/>
	</SearchStack.Navigator>
);

// Education Flow
const EducationStack = createNativeStackNavigator();
const EducationFlow = () => (
	<EducationStack.Navigator
		initialRouteName="Education"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<EducationStack.Screen
			name="Education"
			component={EdScreen}
			options={{
				title: "Pelleum Learn",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
	</EducationStack.Navigator>
);

// Profile Flow
const ProfileStack = createNativeStackNavigator();
const ProfileFlow = () => (
	<ProfileStack.Navigator
		initialRouteName="Profile"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<ProfileStack.Screen
			name="Profile"
			component={ProfileScreen}
			options={{ headerShown: false }}
		/>
		<ProfileStack.Screen
			name="Settings"
			component={SettingsScreen}
			options={{
				title: "Settings",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="Link"
			component={LinkAccount}
			options={{
				title: "Link an Account",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="LinkedStatus"
			component={LinkedAccountsStatus}
			options={{
				title: "Linked Accounts",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="AuthoredTheses"
			component={AuthoredThesesScreen}
			options={{
				title: "My Theses",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="AuthoredPosts"
			component={AuthoredPostsScreen}
			options={{
				title: "My Posts",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="DataPrivacyScreen"
			component={DataPrivacyScreen}
			options={{
				title: "Data Privacy",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="SubscriptionScreen"
			component={SubscriptionScreen}
			options={{
				title: "Subscriptions",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
	</ProfileStack.Navigator>
);

// Bottom Tap App Flow
const AppTabs = createBottomTabNavigator();
const AppFlow = () => (
	<AppTabs.Navigator
		screenOptions={{
			tabBarShowLabel: false,
			tabBarInactiveTintColor: LIGHT_GREY_COLOR,
			tabBarActiveTintColor: TEXT_COLOR,
		}}
	>
		<AppTabs.Screen
			name="FeedFlow"
			component={FeedFlow}
			headerMode="none"
			options={{
				tabBarIcon: ({ color }) => (
					<Foundation name="home" size={26} color={color} />
				),
				headerShown: false,
			}}
		/>
		<AppTabs.Screen
			name="SearchFlow"
			component={SearchFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<FontAwesome name="search" size={25} color={color} />
				),
				headerShown: false,
			}}
		/>
		<AppTabs.Screen
			name="EducationFlow"
			component={EducationFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<Ionicons name="book" size={24.5} color={color} />
				),
				headerShown: false,
			}}
		/>
		<AppTabs.Screen
			name="ProfileFlow"
			component={ProfileFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<Ionicons name="person-sharp" size={25} color={color} />
				),
				headerShown: false,
			}}
		/>
	</AppTabs.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackFlow = () => {

	const { isLoading, hasUserToken } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();

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

	const getAge = dateOfBirth => Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

	const validateToken = async () => {
		const user = await UserManager.getUser();
		if (user) {
			// 1. Get user object from secure store
			const userObjectString = await SecureStore.getItemAsync("userObject");
			const userObject = JSON.parse(userObjectString);
			// 2. Get user's raionales to store in universal state
			await getRationaleLibrary(userObject);
			// 3. Get account linkage statues, and store them in universal state
			await LinkAccountsManager.getLinkedAccountsStatus();
			// 4. Store *some* of the user object in universal state
			dispatch(storeUserObject({
				username: userObject.username,
				userId: userObject.user_id
			}));
			// 5. Identify the user
			segmentClient.identify(user.user_id, {
				email: user.email,
				username: user.username,
				age: getAge(user.birthdate),
				birthday: user.birthdate,
				gender: user.gender,
				createdAt: user.created_at,
				plan: "basic",
			});
		};
	};

	React.useEffect(() => {
		validateToken();
	}, [dispatch]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<RootStack.Navigator screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}>
			{hasUserToken == false ? (
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
				<>
					<RootStack.Screen
						name="AppTabs"
						component={AppFlow}
						options={{
							headerShown: false,
						}}
					/>
					<RootStack.Screen
						name="CreateThesis"
						component={CreateThesisScreen}
						options={{
							title: "Create a Thesis",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
							gestureEnabled: false,
							headerLeft: () => <BackButton />
						}}
					/>
					<RootStack.Screen
						name="CreatePost"
						component={CreatePostScreen}
						options={{
							title: "Create a Post",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
							gestureEnabled: false,	//if true, gesture uses native back navigation (we don't want that)
							headerLeft: () => <BackButton />
						}}
					/>
					<RootStack.Screen
						name="PortfolioInsight"
						component={PortfolioInsightScreen}
						options={{
							title: "Portfolio Insight",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="Post"
						component={PostDetailScreen}
						options={{
							title: "Post Detail",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="Thesis"
						component={ThesisDetailScreen}
						options={{
							title: "Thesis Detail",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
					<RootStack.Screen
						name="Rationales"
						component={RationaleScreen}
						options={{
							title: "Rationale Library",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
						}}
					/>
				</>
			)}
		</RootStack.Navigator>
	);
};

export default () => {
	return (
		<AnalyticsProvider client={segmentClient}>
			<Provider store={store}>
				<NavigationContainer theme={DarkTheme}>
					{Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
					<RootStackFlow />
				</NavigationContainer>
			</Provider>
		</AnalyticsProvider>
	);
};
