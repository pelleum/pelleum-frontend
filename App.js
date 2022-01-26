// Import Installed Libraries
import * as React from "react";
import { Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

// Local Files
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ThesisDetailScreen from "./src/screens/ThesisDetailScreen";
import SearchScreen from "./src/screens/SearchScreen";
import EdScreen from "./src/screens/EdScreen";
import BlogScreen from "./src/screens/BlogScreen";
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
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';
import { useSelector, useDispatch } from 'react-redux';



// Authentication Flow
const AuthStack = createNativeStackNavigator();
const AuthFlow = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
		<AuthStack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
	</AuthStack.Navigator>
);

// Feed Flow
const FeedStack = createNativeStackNavigator();
const FeedFlow = () => (
	<FeedStack.Navigator 
	initialRouteName="Feed"
	screenOptions={{
		headerBackTitleVisible: false,
	}}
	>
		<FeedStack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
	</FeedStack.Navigator>
);

// Search Flow
const SearchStack = createNativeStackNavigator();
const SearchFlow = () => (
	<SearchStack.Navigator
		initialRouteName="Search"
		screenOptions={{
			headerBackTitleVisible: false,
		}}
	>
		<SearchStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
	</SearchStack.Navigator>
);

// Education Flow
const EducationStack = createNativeStackNavigator();
const EducationFlow = () => (
	<EducationStack.Navigator
		initialRouteName="Education"
		screenOptions={{
			headerBackTitleVisible: false,
		}}
	>
		<EducationStack.Screen name="Education" component={EdScreen} options={{ headerShown: false }} />
		<EducationStack.Screen name="BlogPost" component={BlogScreen} options={{ headerTitle: "Blog" }} />
	</EducationStack.Navigator>
);

// Profile Flow
const ProfileStack = createNativeStackNavigator();
const ProfileFlow = () => (
	<ProfileStack.Navigator
		initialRouteName="Profile"
		screenOptions={{
			headerBackTitleVisible: false,
		}}
		// screenOptions={{
		// 	headerStyle: {
		// 		backgroundColor: '#f4511e',
		// 	},
		// 	headerBackTitleVisible: false,
		// 	headerTintColor: '#fff',
		// 	headerTitleStyle: {
		// 		fontWeight: 'bold',
		// 	},
		// }}
	>
		<ProfileStack.Screen
			name="Profile"
			component={ProfileScreen}
			options={{
				headerShown: false,
				// headerTitle: "Custom Profile Header",
				// headerRight: () => (
				// 	<Button
				// 		onPress={() => alert('This is a button!')}
				// 		title="Info"
				// 		color="#fff"
				// 	/>
				// ),
			}}
		/>
		<ProfileStack.Screen name="Settings" component={SettingsScreen} />
		<ProfileStack.Screen name="Link" component={LinkAccount} />
		<ProfileStack.Screen name="LinkedStatus" component={LinkedAccountsStatus} />
		<ProfileStack.Screen name="Authored" component={AuthoredThesesScreen} />
	</ProfileStack.Navigator>
);

// Bottom Tap App Flow
const AppTabs = createBottomTabNavigator();
const AppFlow = () => (
	<AppTabs.Navigator
		screenOptions={{
			tabBarShowLabel: false,
			tabBarInactiveTintColor: '#858585',
			tabBarActiveTintColor: '#000000',
		}}
	>
		<AppTabs.Screen
			name="FeedFlow"
			component={FeedFlow}
			headerMode='none'
			options={{
				tabBarIcon: ({ color }) => (
					<Foundation name="home" size={25} color={color} />
				),
				headerShown: false
			}}
		/>
		<AppTabs.Screen
			name="SearchFlow"
			component={SearchFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<FontAwesome name="search" size={25} color={color} />
				),
				headerShown: false
			}}
		/>
		<AppTabs.Screen
			name="EducationFlow"
			component={EducationFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<Ionicons name="book" size={25} color={color} />
				),
				headerShown: false
			}}
		/>
		<AppTabs.Screen
			name="ProfileFlow"
			component={ProfileFlow}
			options={{
				tabBarIcon: ({ color }) => (
					<Ionicons name="person" size={25} color={color} />
				),
				headerShown: false,
			}}
		/>
	</AppTabs.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackFlow = () => {
	const { isLoading, hasUserToken } = useSelector(state => state.authReducer);
	const dispatch = useDispatch();

	const getRationaleLibrary = async () => {
		const userObjectString = await SecureStore.getItemAsync('userObject');
		const userObject = JSON.parse(userObjectString);
		const retrievedRationales = await RationalesManager.retrieveRationales({ user_id: userObject.user_id });
		if (retrievedRationales) {
			const rationaleInfo = await RationalesManager.extractRationaleInfo(retrievedRationales.records.rationales);
			dispatch(refreshLibrary(rationaleInfo));
		};
	};

	const validateToken = async () => {
		const user = await UserManager.getUser();
		if (user) {
			await getRationaleLibrary();
			await LinkAccountsManager.getLinkedAccountsStatus();
		};
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
					/>
					<RootStack.Screen
						name="CreatePost"
						component={CreatePostScreen}
					/>
					<RootStack.Screen name="PortfolioInsight" component={PortfolioInsightScreen} />
					<RootStack.Screen name="Post" component={PostDetailScreen} />
					<RootStack.Screen name="Thesis" component={ThesisDetailScreen} />
					<RootStack.Screen name="Rationales" component={RationaleScreen} />
				</>
			)}
		</RootStack.Navigator>
	);
};

export default () => {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<RootStackFlow />
			</NavigationContainer>
		</Provider>
	);
};

// const ProfileDrawer = createDrawerNavigator();
// const ProfileDrawerScreen = () => (
// 	<ProfileDrawer.Navigator drawerPosition="right">
// 		<ProfileDrawer.Screen 
// 			name="Profile" 
// 			component={ProfileFlow} 
// 		/>
// 		<ProfileDrawer.Screen
// 			name="Settings"
// 			component={SettingsScreen}
// 			options={{
// 				gestureEnabled: false,
// 			}}
// 		/>
// 	</ProfileDrawer.Navigator>
// );
