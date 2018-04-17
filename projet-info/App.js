import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import Connexion from './pages/connexion'
import Inscription from './pages/inscription'
import { StackNavigator } from 'react-navigation';
import * as firebase from 'firebase';
import {config} from './firebase/constants';
//import Main from './pages/main';
import {TabNavUserLogged, TabNavUserNotLogged} from './pages/main'
import {bootstrap} from './config/bootstrap'
import {Font} from 'expo';
import TimerMixin from 'react-timer-mixin';


bootstrap();
const RootStackUserNotLogged = StackNavigator({
  
  UserLogged: {
      screen: TabNavUserLogged,
      navigationOptions:  
          {
              headerLeft: null
          }
      },
  UserNotLogged : {
      screen: TabNavUserNotLogged,
      }
  },
  {
    initialRouteName: 'UserNotLogged',
  }
); 

const RootStackUserLogged = StackNavigator({
  UserLogged: {
      screen: TabNavUserLogged,
      navigationOptions:  
          {
              headerLeft: null
          }
      },
  UserNotLogged : {
      screen: TabNavUserNotLogged,
      }
  },
  {
    initialRouteName: 'UserLogged',
  }
); 

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user : null,
      loading : false,
      initialRouteName : 'Connexion'
    }
  
    console.disableYellowBox = true;

   this.loadAssets = this._loadAssets.bind(this)
  }


  componentWillMount(){
    this.loadAssets()
    this.setState({loading: true})
    firebase.initializeApp(config);
    firebase.auth()
    .onAuthStateChanged((user) => {
      if(user){
        this.setState({
          user : user,
          initialRouteName : 'Main'
        })
      }
      else{
        this.setState({ initialRouteName : 'Connexion'})
      }
      this.setState({loading: false})
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
    return( <View style = {styles.container}><ActivityIndicator  size="large"/></View> )
    }
    else if (this.state.user)
    {
      return <RootStackUserLogged/>
    }
    else 
    {
      return <RootStackUserNotLogged/>

    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
})

