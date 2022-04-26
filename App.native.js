// Import Installed Libraries
import 'expo-dev-client';
import * as React from "react";
import { StatusBar, Platform, Image } from 'react-native';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import { createClient, AnalyticsProvider } from "@segment/analytics-react-native";

// Local Files
import LocalStorage from './src/storage/LocalStorage';
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ThesisDetailScreen from "./src/screens/ThesisDetailScreen";
import SearchScreen from "./src/screens/SearchScreen";
import EducationScreen from "./src/screens/EducationScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PortfolioInsightScreen from "./src/screens/PortfolioInsightScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import CreateThesisScreen from "./src/screens/CreateThesisScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import LinkAccountScreen from "./src/screens/LinkAccountScreen";
import LinkedAccountsStatusScreen from "./src/screens/LinkedAccountsStatusScreen";
import RationaleScreen from "./src/screens/RationaleScreen";
import AuthoredThesesScreen from "./src/screens/AuthoredThesesScreen";
import AuthoredPostsScreen from "./src/screens/AuthoredPostsScreen";
import DataPrivacyScreen from './src/screens/DataPrivacyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import RationalesManager from "./src/managers/RationalesManager";
import UserManager from "./src/managers/UserManager";
import NotificationManager from './src/managers/NotificationManager';
import LinkAccountsManager from "./src/managers/LinkAccountsManager";
import { LIGHT_GREY_COLOR, MAIN_BACKGROUND_COLOR, MAIN_SECONDARY_COLOR, TEXT_COLOR } from "./src/styles/Colors";
import BackButton from './src/components/BackButton';
import NotificationBottomTabIcon from './src/components/NotificationBottomTabIcon';

// Redux
import { Provider } from "react-redux";
import { store } from "./src/redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { refreshLibrary } from "./src/redux/actions/RationaleActions";
import { storeUserObject } from "./src/redux/actions/AuthActions";

// Segment Client
const segmentClient = createClient({
	writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY,
	trackAppLifecycleEvents: true,
});

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

// Feed Flow
const FeedStack = createNativeStackNavigator();
const FeedFlow = () => (
	<FeedStack.Navigator
		initialRouteName="FeedScreen"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<FeedStack.Screen
			name="FeedScreen"
			component={FeedScreen}
			options={{ headerShown: false }}
		/>
	</FeedStack.Navigator>
);

// Search Flow
const SearchStack = createNativeStackNavigator();
const SearchFlow = () => (
	<SearchStack.Navigator
		initialRouteName="SearchScreen"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<SearchStack.Screen
			name="SearchScreen"
			component={SearchScreen}
			options={{ headerShown: false }}
		/>
	</SearchStack.Navigator>
);

// Notifications Flow
const NotificationsStack = createNativeStackNavigator();
const NotificationsFlow = () => (
	<NotificationsStack.Navigator
		initialRouteName="NotificationsScreen"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<NotificationsStack.Screen
			name="NotificationsScreen"
			component={NotificationsScreen}
			options={{
				title: "Notifications",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
	</NotificationsStack.Navigator>
);

// Education Flow
const EducationStack = createNativeStackNavigator();
const EducationFlow = () => (
	<EducationStack.Navigator
		initialRouteName="EducationScreen"
		screenOptions={{ headerBackTitleVisible: false, headerTintColor: MAIN_SECONDARY_COLOR }}
	>
		<EducationStack.Screen
			name="EducationScreen"
			component={EducationScreen}
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
			}}
		/>
		<ProfileStack.Screen
			name="LinkAccountScreen"
			component={LinkAccountScreen}
			options={{
				title: "Link an Account",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="LinkedAccountsStatusScreen"
			component={LinkedAccountsStatusScreen}
			options={{
				title: "Linked Accounts",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="AuthoredThesesScreen"
			component={AuthoredThesesScreen}
			options={{
				title: "My Theses",
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
				headerTitleStyle: { color: TEXT_COLOR },
			}}
		/>
		<ProfileStack.Screen
			name="AuthoredPostsScreen"
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
			name="NotificationsFlow"
			component={NotificationsFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<NotificationBottomTabIcon color={color} />
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
			const userObjectString = await LocalStorage.getItem("userObject");
			const userObject = JSON.parse(userObjectString);
			// 2. Get user's raionales to store in universal state
			await getRationaleLibrary(userObject);
			// 3. Get user's notifications to store in universal state
			await NotificationManager.getNotifications();
			// 4. Get account linkage statues, and store them in universal state
			await LinkAccountsManager.getLinkedAccountsStatus();
			// 5. Store *some* of the user object in universal state
			dispatch(storeUserObject({
				username: userObject.username,
				userId: userObject.user_id,
			}));
			// 5. Identify the user
			segmentClient.identify(user.user_id, {
				email: user.email,
				username: user.username,
				age: getAge(user.birthdate),
				birthday: user.birthdate,
				gender: user.gender,
				createdAt: user.created_at,
				platform: Platform.OS,
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
					<RootStack.Screen
						name="CreatePostScreen"
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
						name="PortfolioInsightScreen"
						component={PortfolioInsightScreen}
						options={{
							title: "Portfolio Insight",
							headerTitleAlign: 'center',
							headerStyle: { backgroundColor: MAIN_BACKGROUND_COLOR },
							headerTitleStyle: { color: TEXT_COLOR },
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
						name="RationaleScreen"
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
		<AnalyticsProvider client={segmentClient}>
			<Provider store={store}>
				<NavigationContainer linking={linking} fallback={<LoadingScreen />} theme={DarkTheme}>
					{Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : <StatusBar backgroundColor="black" />}
					<RootStackFlow />
				</NavigationContainer>
			</Provider>
		</AnalyticsProvider>
	);
};
