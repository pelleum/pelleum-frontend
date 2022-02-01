// Import Installed Libraries
import * as React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

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
import RationalesManager from "./src/managers/RationalesManager";
import UserManager from "./src/managers/UserManager";
import { refreshLibrary } from "./src/redux/actions/RationaleActions";
import LinkAccountsManager from "./src/managers/LinkAccountsManager";

// Redux
import { Provider } from "react-redux";
import { store } from "./src/redux/Store";
import { useSelector, useDispatch } from "react-redux";

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
		screenOptions={{ headerBackTitleVisible: false }}
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
		screenOptions={{ headerBackTitleVisible: false }}
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
		screenOptions={{ headerBackTitleVisible: false }}
	>
		<EducationStack.Screen
			name="Education"
			component={EdScreen}
			options={{ headerTitle: "Pelleum Learn" }}
		/>
	</EducationStack.Navigator>
);

// Profile Flow
const ProfileStack = createNativeStackNavigator();
const ProfileFlow = () => (
	<ProfileStack.Navigator
		initialRouteName="Profile"
		screenOptions={{ headerBackTitleVisible: false }}
	>
		<ProfileStack.Screen
			name="Profile"
			component={ProfileScreen}
			options={{ headerShown: false }}
		/>
		<ProfileStack.Screen
			name="Settings"
			component={SettingsScreen}
			options={{ headerTitle: "Settings" }}
		/>
		<ProfileStack.Screen
			name="Link"
			component={LinkAccount}
			options={{ headerTitle: "Link an Account" }}
		/>
		<ProfileStack.Screen
			name="LinkedStatus"
			component={LinkedAccountsStatus}
			options={{ headerTitle: "Linked Accounts" }}
		/>
		<ProfileStack.Screen
			name="Authored"
			component={AuthoredThesesScreen}
			options={{ headerTitle: "Authored Theses" }}
		/>
	</ProfileStack.Navigator>
);

// Bottom Tap App Flow
const AppTabs = createBottomTabNavigator();
const AppFlow = () => (
	<AppTabs.Navigator
		screenOptions={{
			tabBarShowLabel: false,
			tabBarInactiveTintColor: "#858585",
			tabBarActiveTintColor: "white",
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

	const getRationaleLibrary = async () => {
		const userObjectString = await SecureStore.getItemAsync("userObject");
		const userObject = JSON.parse(userObjectString);
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

	const validateToken = async () => {
		const user = await UserManager.getUser();
		if (user) {
			await getRationaleLibrary();
			await LinkAccountsManager.getLinkedAccountsStatus();
		}
	};

	React.useEffect(() => {
		validateToken();
	}, [dispatch]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<RootStack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
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
						options={{ headerTitle: "Create a Thesis" }}
					/>
					<RootStack.Screen
						name="CreatePost"
						component={CreatePostScreen}
						options={{ headerTitle: "Create a Post" }}
					/>
					<RootStack.Screen
						name="PortfolioInsight"
						component={PortfolioInsightScreen}
						options={{ headerTitle: "Portfolio Insight" }}
					/>
					<RootStack.Screen
						name="Post"
						component={PostDetailScreen}
						options={{ headerTitle: "Post Detail" }}
					/>
					<RootStack.Screen
						name="Thesis"
						component={ThesisDetailScreen}
						options={{ headerTitle: "Thesis Detail" }}
					/>
					<RootStack.Screen
						name="Rationales"
						component={RationaleScreen}
						options={{ headerTitle: "Rationale Library" }}
					/>
				</>
			)}
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
