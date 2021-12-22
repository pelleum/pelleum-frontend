// Import Installed Libraries
import * as React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import { Ionicons, FontAwesome, FontAwesome5, Foundation } from "@expo/vector-icons";

// Local Screens
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

// Functions
import pelleumClient from "./src/api/PelleumClient";

// Redux
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { restoreToken } from "./src/redux/actions";


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
	<FeedStack.Navigator initialRouteName="Feed">
		<FeedStack.Screen name="Feed" component={FeedScreen} />
		<FeedStack.Screen name="Post" component={PostDetailScreen} />
		<FeedStack.Screen name="Thesis" component={ThesisDetailScreen} />
		<FeedStack.Screen name="PortfolioInsight" component={PortfolioInsightScreen} />
	</FeedStack.Navigator>
);

// Search Flow
const SearchStack = createNativeStackNavigator();
const SearchFlow = () => (
	<SearchStack.Navigator initialRouteName="Search">
		<SearchStack.Screen name="Search" component={SearchScreen} />
		<SearchStack.Screen name="Thesis" component={ThesisDetailScreen} />
		<SearchStack.Screen name="PortfolioInsight" component={PortfolioInsightScreen} />
	</SearchStack.Navigator>
);

// Education Flow
const EducationStack = createNativeStackNavigator();
const EducationFlow = () => (
	<EducationStack.Navigator initialRouteName="Education">
		<EducationStack.Screen name="Education" component={EdScreen} />
		<EducationStack.Screen name="BlogPost" component={BlogScreen} />
	</EducationStack.Navigator>
);

// Profile Flow
const ProfileStack = createNativeStackNavigator();
const ProfileFlow = () => (
	<ProfileStack.Navigator initialRouteName="Profile">
		<ProfileStack.Screen name="Profile" component={ProfileScreen} />
		<ProfileStack.Screen name="Post" component={PostDetailScreen} />
		<ProfileStack.Screen name="Thesis" component={ThesisDetailScreen} />
		<ProfileStack.Screen name="Settings" component={SettingsScreen} />
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
					<FontAwesome5 name="coins" size={25} color={color} />
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

	const validateToken = async () => {

		const authorizedResponse = await pelleumClient({ method: 'get', url: '/public/auth/users' });

		if (authorizedResponse) {
			if (authorizedResponse.status == 200) {
				dispatch(restoreToken());
			} else {
				console.log("Some error occurred restoring token.")
			};
		}
	};

	React.useEffect(() => {
		validateToken();
	}, [dispatch]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<RootStack.Navigator screenOptions={{ animationEnabled: false }}>
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
				<RootStack.Screen
					name="AppTabs"
					component={AppFlow}
					options={{
						headerShown: false,
					}}
				/>
			)}
			<RootStack.Screen
				name="CreateThesis"
				component={CreateThesisScreen}
			/>
			<RootStack.Screen
				name="CreatePost"
				component={CreatePostScreen}
			/>
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
