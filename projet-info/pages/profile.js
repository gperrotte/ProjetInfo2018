/*import React from 'react';
import { Text, View, Image, AsyncStorage, TouchableHighlight} from 'react-native';
import {Button , FormInput, FormLabel, FormValidationMessage, Icon} from 'react-native-elements';
import {NavigationActions} from 'react-navigation';
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';


export default class PageProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
             image: null,
        }
    }

    componentDidMount(){
        this.loadItem("imageProfile");
    }

    signOut = () => {
        firebase.auth()
        .signOut()
        .then(() => {
            this.resetNavigation();
            //this.props.navigation.navigate('Connexion');
        })
    }

    resetNavigation() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Motos' })
            ]
          })
          this.props.navigation.dispatch(resetAction)
          this.props.navigation.navigate('Connexion');
      }

      
    //key est un string permettant de retrouver l'item
    saveItem = (key, item) => {
        AsyncStorage.setItem(key, item)
    }

    loadItem = (key) => {
        AsyncStorage.getItem(key)
        .then((value) => {
            this.setState({image:value})
        })
        .done();
    }

    pickImage = async () => {
        //selection d'une image dans la galerie 
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 4],
        });
    
        
        if (!result.cancelled) {
          this.setState({ image: result.uri });
          this.saveItem("imageProfile", this.state.image)
        }

      };

      renderImageProfile = () => {
        if(this.state.image !== null){
            let {image} = this.state
            return(
            <TouchableHighlight onPress={this.pickImage}>
               <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius:0 }} />
            </TouchableHighlight>
            );
        }
      }

    render(){
        let { image } = this.state;
        return(
            <View>
                <View>
                    {this.renderImageProfile()}
                </View>
                <View >
                <Button title = 'Dec' onPress = {this.signOut.bind(this)}/>
                </View>
            </View>
             )
    }
    }
*/

import {NavigationActions} from 'react-navigation';
import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert
} from 'react-native';
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet,
  RkButton,
} from 'react-native-ui-kitten';
import * as firebase from 'firebase'
import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';
import {KittenTheme} from '../config/theme'

export default class PageProfile extends React.Component {
  static navigationOptions = {
    title: 'Profile'
  };

  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser


    this.state = {
      email: this.user.email,
      password: 'aaaaaaaa',
      newPassword : 'aaaaaaaa',
      confirmPassword: 'aaaaaaaa',
      error: '',
    }
  }

  signOut = () => {
    firebase.auth()
    .signOut()
    .then(() => {
        this.resetNavigation();
        //this.props.navigation.navigate('Connexion');
    })
    }
/*
    resetNavigation(targetRoute) {
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: targetRoute }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }
    */

    resetNavigation() {
        const resetAction = NavigationActions.reset({
            index: 0,
            key : null,
            actions: [
            NavigationActions.navigate({ routeName: 'UserNotLogged' })
            ]
        })
        this.props.navigation.dispatch(resetAction)
        //this.props.navigation.navigate('UserNotLogged');
    }

    updatePassword = () => {

        const user = firebase.auth().currentUser;
        const {email, password, newPassword, confirmPassword} = this.state;
        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            if(confirmPassword === newPassword)
            {
                user.updatePassword(newPassword).then(() => this.setState({password: '', newPassword : '', confirmPassword : ''}) )
                .then(() => Alert.alert('Changement réussi !'))
                .catch(() => this.setState({error: 'Confirmer le mot de passe'}))
            }
        }).catch(() => this.setState({error: 'Ancien mot de passe incorrect'}))
    }
    

  render() {
    return (
      <ScrollView style={styles.root}>
        <RkAvoidKeyboard>
          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6'>INFO</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Email'
                           value={this.state.email}
                           editable = {false}
                           rkType='right clear'/>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6'>CHANGER MOT DE PASSE</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Actuel'
                           value={this.state.password}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({password: text})}/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Nouveau'
                           value={this.state.newPassword}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({newPassword: text})}/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Confirmer'
                           value={this.state.confirmPassword}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({confirmPassword: text})}/>

            </View>
            <View style = {{alignItems : 'center', marginTop : scaleVertical(20)}}>
                    <RkText rkType = 'danger'>{this.state.error}</RkText></View>
            <View style = {{alignItems : 'center', marginTop : scaleVertical(20)}}>
                <RkButton rkType='rounded ' style={styles.button}
                            onPress = {() => this.updatePassword()}> Modifier </RkButton>
            </View>

            <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6'>SE DECONNECTER</RkText>
            </View>
            <View style = {{alignItems : 'center', marginTop : scaleVertical(20)}}>
                <RkButton rkType='rounded ' 
                            style={styles.buttonSignout} 
                            onPress = {this.signOut.bind(this)}> Se déconnecter </RkButton>
            </View>
          </View>

          </View>
        </RkAvoidKeyboard>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32,
    width: scaleHonrizontal(280),
    height : scaleVertical(50)
  },
  buttonSignout: {
    marginHorizontal: 16,
    marginBottom: 32,
    width: scaleHonrizontal(280),
    height : scaleVertical(50),
    backgroundColor : theme.colors.primary
  }
}));
