import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import PageMoto from './motos';
import PageProfile from './profile';
import PageGPS from './gps';
import PageDetailMoto from './detailMoto';
import PageConnexion from './connexion';
import PageInscription from './inscription';
import PageMotoEssai from './motoEssai'
import PageGPSEssai from './gpsEssai'

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

const profileNavigator = StackNavigator({
    Connexion : {
        screen: PageConnexion,
        navigationOptions:  
            {
                headerLeft: null
            }
        },
        Inscription : {
        screen: PageInscription,
        },

    },
    {
        initialRouteName: 'Connexion',
    }
); 




//Export par défaut si probleme
export const TabNavUserLogged =  TabNavigator({
    Motos : { 
        screen : motosNavigator,
        navigationOptions:  
            {
                header: null
            }
    },
    GPS : {
        screen : PageGPS,
        navigationOptions: ({ navigation }) => ({
            headerLeft:null,
            tabBarOnPress: () => navigation.navigate("GPS", { date: new Date() })
            })
        },        
    Profile : {
        screen : PageProfile,
        navigationOptions: {
            headerLeft : null,
        }
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
        } else if (routeName === 'GPS'){
            iconName = 'location';
            iconType = 'entypo';
        } else if (routeName === 'Profile') {
          iconName = 'user';
          iconType = 'font-awesome';
        } 
            return <Icon name={iconName} type={iconType} size={25} color={tintColor} />;
      },
    }),


    tabBarOptions: {
      activeTintColor: '#1565c0',
      inactiveTintColor: '#b0bec5',
    },
    
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);


export const TabNavUserNotLogged =  TabNavigator({
    Motos : { 
        screen : PageMotoEssai,
    },
    GPS : {
        screen : PageGPSEssai,
        navigationOptions: ({ navigation }) => ({
            headerLeft:null,
            tabBarOnPress: () => navigation.navigate("GPS", { date: new Date() })
            })
        },        
    Profile : {
        screen : profileNavigator,
        navigationOptions: {
            headerLeft : null,
        }
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
        } else if (routeName === 'GPS'){
            iconName = 'location';
            iconType = 'entypo';
        } else if (routeName === 'Profile') {
          iconName = 'user';
          iconType = 'font-awesome';
        } 
            return <Icon name={iconName} type={iconType} size={25} color={tintColor} />;
      },
    }),


    tabBarOptions: {
      activeTintColor: '#1565c0',
      inactiveTintColor: '#b0bec5',
    },
    
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);