// Import Installed Libraries
import * as React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";

// Import Local Files
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
import AuthContext from "./src/context/AuthContext";
import { AuthProvider } from "./src/context/AuthContext";
//import CreateScreen from "./src/screens/CreateScreen";

// Authentication Flow
const AuthStack = createNativeStackNavigator();
const AuthFlow = () => (
	<AuthStack.Navigator>
		{/* <AuthStack.Screen name="AuthLoading" component={LoadingScreen} /> */}
		<AuthStack.Screen name="Login" component={LoginScreen} />
		<AuthStack.Screen name="SignUp" component={SignupScreen} />
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
					<Ionicons name="ios-person" size={25} color={color} />
				),
				headerShown: false,
			}}
		/>
	</AppTabs.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackFlow = () => {
	const { state, dispatch } = React.useContext(AuthContext);

	React.useEffect(() => {
		const fetchToken = async () => {
			let userToken;
			try {
				userToken = await SecureStore.getItemAsync('userToken');
			} catch (err) {
				// Restoring token failed
				console.log('Unable to fetch token.');
			}
			// After restoring token, we may need to validate it
			dispatch({ type: 'RESTORE_TOKEN', token: userToken });
		};
		fetchToken();
	}, [dispatch]);

	if (state.isLoading) {
		// We haven't finished checking for the token yet
		return <LoadingScreen />;
	}

	return (
		<RootStack.Navigator>
			{state.userToken == null ? (
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
		</RootStack.Navigator>
	);
};

export default () => {
	return (
		<AuthProvider>
			<NavigationContainer>
				<RootStackFlow />
			</NavigationContainer>
		</AuthProvider>
	);
};




/*

//import installed libraries
import * as React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";

//local file imports
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
import { Provider as AuthProvider } from "./src/context/AuthContext"; //renaming Provider as AuthProvider in App.js
import { setNavigator } from "./src/navigationRef";
import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";
import CreateScreen from "./src/screens/CreateScreen";

const switchNavigator = createSwitchNavigator(
	{
		AuthLoad: AuthLoadingScreen,
		loginFlow: createStackNavigator({
			Signup: SignupScreen,
			Login: LoginScreen,
		}),
		mainFlow: createBottomTabNavigator(
			{
				feedFlow: {
					screen: createStackNavigator({
						Feed: FeedScreen,
						feedPostFlow: createStackNavigator({
							Post: PostDetailScreen,
							Portfolio: PortfolioInsightScreen,
						}),
					}),
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (
							<Foundation name="home" size={25} color={tintColor} />
						),
					},
				},
				searchFlow: {
					screen: createStackNavigator({
						Search: SearchScreen,
						searchThesisFlow: createStackNavigator({
							Thesis: ThesisDetailScreen,
							Portfolio: PortfolioInsightScreen,
						}),
					}),
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (
							<FontAwesome name="search" size={25} color={tintColor} />
						),
					},
				},
				createFlow: {
					screen: createStackNavigator({
						Create: CreateScreen,
					}),
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (
							<FontAwesome name="plus-square" size={25} color={tintColor} />
						),
					},
				},
				educationFlow: {
					screen: createStackNavigator({
						Education: EdScreen,
						Blog: BlogScreen,
					}),
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (
							<Ionicons name="book" size={25} color={tintColor} />
						),
					},
				},
				profileFlow: {
					screen: createStackNavigator({
						Profile: ProfileScreen,
						Settings: SettingsScreen,
						feedPostFlow: createStackNavigator({
							Post: PostDetailScreen,
							Portfolio: PortfolioInsightScreen,
						}),
					}),
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (
							<Ionicons name="ios-person" size={25} color={tintColor} />
						),
					},
				},
			},
			{
				tabBarOptions: {
					inactiveTintColorL: "#858585",
					activeTintColor: "#000000",
					activeBackgroundColor: "#ebecf0",
					showLabel: false,
				},
			}
		),
	},
	{
		initialRouteName: "AuthLoad",
	}
);

const App = createAppContainer(switchNavigator);

export default () => {
	return (
		<AuthProvider>
			<App
				ref={(navigator) => {
					setNavigator(navigator);
				}}
			/>
		</AuthProvider>
	);
};

*/














// const RootStack = createNativeStackNavigator();
// const RootStackFlow = () => {
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [user, setUser] = React.useState(null);
//     React.useEffect(() => {
//         setTimeout(() => {
//             setIsLoading(!isLoading);
//             setUser({}); // If we have token, set user to user object, so it's always accessible?
//         }, 500);
//     }, []);

// 	return (
//         <RootStack.Navigator
//             headerMode="none"
//             screenOptions={{ animationEnabled: false }}
//             mode="modal"
//         >
//             {isLoading ? (
//                 <RootStack.Screen name="Loading" component={LoadingScreen} />
//             ) : user ? (
//                 <RootStack.Screen name="AppTabs" component={AppFlow} />
//             ) : (
//                 <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
//             )}
//             <RootStack.Screen
//                 name="Create"
//                 component={CreateScreen}
//                 options={{ animationEnabled: true }}
//             />
//         </RootStack.Navigator>
//     );
// };







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