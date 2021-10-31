//import installed libraries
import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

//local file imports
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import FeedScreen from './src/screens/FeedScreen';
import ThesisDetailScreen from './src/screens/ThesisDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import EdScreen from './src/screens/EdScreen';
import BlogScreen from './src/screens/BlogScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PortfolioInsightScreen from './src/screens/PortfolioInsightScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Provider as AuthProvider } from './src/context/AuthContext'; //renaming Provider as AuthProvider in App.js
import { setNavigator } from './src/navigationRef';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';

const switchNavigator = createSwitchNavigator({
	AuthLoad: AuthLoadingScreen,
	loginFlow: createStackNavigator({
		Signup: SignupScreen,
		Login: LoginScreen
	}),
	mainFlow: createBottomTabNavigator({
		feedFlow: {
			screen: createStackNavigator({
				Feed: FeedScreen,
				feedPostFlow: createStackNavigator({
					Post: PostDetailScreen,
					Portfolio: PortfolioInsightScreen
				}),
				feedThesisFlow: createStackNavigator({
					Thesis: ThesisDetailScreen,
					Portfolio: PortfolioInsightScreen
				})
			}),
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => (<Foundation name="home" size={24} color="black" />),
				tabBarLabel:() => {return null}
			}
		},
		//search results in a list of filtered theses (by asset) or usernames
		searchFlow: {
			screen: createStackNavigator({
				Search: SearchScreen
			}),
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => (<FontAwesome name="search" size={24} color="black" />),
				tabBarLabel:() => {return null}
			}
		},
		educationFlow: {
			screen: createStackNavigator({
				Education: EdScreen,
				Blog: BlogScreen
			}),
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => (<Ionicons name="book" size={24} color="black" />),
				tabBarLabel:() => {return null}
			}
		},
		profileFlow: {
			screen: createStackNavigator({
				Profile: ProfileScreen,
				Settings: SettingsScreen,
				feedPostFlow: createStackNavigator({
					Post: PostDetailScreen,
					Portfolio: PortfolioInsightScreen
				}),
				feedThesisFlow: createStackNavigator({
					Thesis: ThesisDetailScreen,
					Portfolio: PortfolioInsightScreen
				})
			}),
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-person" size={24} color="black" />),
				tabBarLabel:() => {return null}
			}
		}
	})
}, {
	initialRouteName: 'AuthLoad'
});

const App = createAppContainer(switchNavigator);

export default () => {
	return (
		<AuthProvider>
			<App ref={(navigator) => { setNavigator(navigator) }} />
		</AuthProvider>
	);
};