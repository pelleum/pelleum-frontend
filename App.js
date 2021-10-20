//import installed libraries
import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
//import { createDrawerNavigator } from 'react-navigation-drawer';

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
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import { Provider as AuthProvider} from './src/context/AuthContext'; //renaming Provider as AuthProvider in App.js
import { setNavigator } from './src/navigationRef';

const switchNavigator = createSwitchNavigator({
	loginFlow: createStackNavigator({
		Signup: SignupScreen,
		Login: LoginScreen
	}),
	mainFlow: createBottomTabNavigator({
		feedFlow: createStackNavigator({
			Feed: FeedScreen,
			feedPostFlow: createStackNavigator({
				Post: PostDetailScreen,
				Portfolio: PortfolioInsightScreen
			}),
			feedThesisFlow: createStackNavigator({
				Thesis: ThesisDetailScreen,
				Portfolio: PortfolioInsightScreen,
				Account: AccountSettingsScreen
			})
		}),
		//search results in a list of filtered theses (by asset) or usernames
		searchFlow: createStackNavigator({
			Search: SearchScreen,
		}),
		educationFlow: createStackNavigator({
			Education: EdScreen,
			Blog: BlogScreen
		}),
		profileFlow: createStackNavigator({
			Profile: ProfileScreen,
			feedPostFlow: createStackNavigator({
				Post: PostDetailScreen,
				Portfolio: PortfolioInsightScreen
			}),
			feedThesisFlow: createStackNavigator({
				Thesis: ThesisDetailScreen,
				Portfolio: PortfolioInsightScreen
			})
		}),
	})
});

const App = createAppContainer(switchNavigator);

export default () => {
	return (
		<AuthProvider>
			<App ref={(navigator) => { setNavigator(navigator) }} />
		</AuthProvider>
	);
};