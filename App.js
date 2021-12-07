// Import Installed Libraries
import * as React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import { Ionicons, FontAwesome, FontAwesome5, Foundation } from "@expo/vector-icons";

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
import { Provider as AuthProvider } from "./src/context/AuthContext"; //renaming Provider as AuthProvider in App.js
import { setNavigator } from "./src/navigationRef";
import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import CreateThesisScreen from "./src/screens/CreateThesisScreen";

// // Login and Sign Up Flow
// const AuthStack = createNativeStackNavigator();
// const AuthStackScreen = () => (
//     <AuthStack.Navigator>
//         <AuthStack.Screen name="Login" component={LoginScreen} />
//         <AuthStack.Screen name="SignUp" component={SignupScreen} />
//     </AuthStack.Navigator>
// );

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

const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => (
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

// const RootStack = createNativeStackNavigator();
// const RootStackScreen = () => {
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
//                 <RootStack.Screen name="Loading" component={AuthLoadingScreen} />
//             ) : user ? (
//                 <RootStack.Screen name="AppTabs" component={AppTabsScreen} />
//             ) : (
//                 <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
//             )}
//             <RootStack.Screen
//                 name="Create"
//                 component={CreatePostScreen}
//                 options={{ animationEnabled: true }}
//             />
//         </RootStack.Navigator>
//     );
// };

const RootStack = createNativeStackNavigator();
const RootStackScreen = () => {

	return (
		<RootStack.Navigator
			headerMode="none"
			screenOptions={{
				animationEnabled: false,
				//cardStyle: { backgroundColor: '#000000' }
			}}
			mode="modal"
			options={{ presentation: "modal" }}
		>
			<RootStack.Screen 
				name="AppTabs" 
				component={AppTabsScreen} 
				options={{
					headerShown: false,
				}}
			/>
			<RootStack.Screen
				name="CreatePost"
				component={CreatePostScreen}
				options={{ animationEnabled: true }}
			/>
			<RootStack.Screen
				name="CreateThesis"
				component={CreateThesisScreen}
				options={{ animationEnabled: true }}
			/>
		</RootStack.Navigator>
	);
};

export default () => {
	return (
		<NavigationContainer>
			<RootStackScreen />
		</NavigationContainer>
	);
};




