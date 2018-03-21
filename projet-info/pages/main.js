import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import PageMoto from './motos';
import PageProfile from './profile';
import PageCarnet from './carnet';
import PageDetailMoto from './detailMoto';


const motosNavigator = StackNavigator({
    Motos : {
        screen: PageMoto,
        navigationOptions:  
            {
                headerLeft: null
            }
        },
    DetailMoto : {
        screen: PageDetailMoto,
        }
    },
    {
        initialRouteName: 'Motos',
    }
); 


export default TabNavigator({
    Motos : { 
        screen : motosNavigator,
        navigationOptions:  
            {
                header: null
            }
    },
    Carnet : {screen : PageCarnet,
        navigationOptions: {
            headerLeft:null}
        },
    Profile : {screen : PageProfile,
        navigationOptions:  {
            headerLeft: null,}
        }
    },
    {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let iconType;
        if (routeName === 'Motos') {
          iconName = 'motorcycle';
          iconType = 'font-awesome';
        } else if (routeName === 'Carnet'){
            iconName = 'md-construct';
            iconType = 'ionicon';
        } else if (routeName === 'Profile') {
          iconName = 'user';
          iconType = 'font-awesome';
        } 

        return <Icon name={iconName} type={iconType} size={25} color={tintColor} />;
      },
    }),


    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);