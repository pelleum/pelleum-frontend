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
