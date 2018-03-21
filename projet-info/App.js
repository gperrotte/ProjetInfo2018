import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Connexion from './pages/connexion'
import Inscription from './pages/inscription'
import { StackNavigator } from 'react-navigation';
import * as firebase from 'firebase';
import {config} from './firebase/constants';
import Main from './pages/main';
import {bootstrap} from './config/bootstrap'
import {Font} from 'expo';


bootstrap();
const RootStackUserLogged = StackNavigator(
  {
    Connexion: {
      screen: Connexion,
    },

    Inscription: {
      screen: Inscription
    },

    Main : {
      screen : Main
    }
  },
  {
    initialRouteName: 'Main',
  }
);

const RootStackUserNotLogged = StackNavigator(
  {
    Connexion: {
      screen: Connexion
    },

    Inscription: {
      screen: Inscription
    },

    Main : {
      screen : Main
    }
  },
  {
    initialRouteName: 'Connexion',
  }
);

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user : null,
      loading : false
    }
  }

  componentWillMount(){
    this.setState({loading: true})
    this._loadAssets();
    firebase.initializeApp(config);
    firebase.auth()
    .onAuthStateChanged((user) => {
      if(user){
        this.setState({
          user : user,
          loading : false,
        })
      }
      else{
        this.setState({loading : false})
      }
    });
  }


  _loadAssets = async() => {
    await Font.loadAsync({
      'fontawesome': require('./assets/fonts/fontawesome.ttf'),
      'icomoon': require('./assets/fonts/icomoon.ttf'),
      'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    });
  };

  render() {
    if(this.state.loading)
    {
      //TODO : montrer un icone loading qui tourne 
      return <Text> loading </Text>
    }
    else if(this.state.user){
      return <RootStackUserLogged/>
    }
    else{
      return <RootStackUserNotLogged/>
    }
  }
}


