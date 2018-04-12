import React from 'react';
import {
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard, 
  RkStyleSheet
} from 'react-native-ui-kitten';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {RkTheme} from 'react-native-ui-kitten';
import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';
import * as firebase from 'firebase'
import { NavigationActions } from 'react-navigation';


export default class Connexion extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props);
    this.state = {
      id :'',
      password:'',
      error :'',
      loading : false,
      };
    login = this.login.bind(this)
 }

 //Permet de remettre à 0 la navigation
 //Empeche de pouvoir revenir en arrière après la connexion 

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
    login = () => {
      
    this.setState({loading: true })
    const { id, password } = this.state
    //identification
    firebase.auth()
    .signInWithEmailAndPassword(id, password)
    .then(() => { this.setState({ error: '', loading: false });
                this.resetNavigation('UserLogged');})
    
     //Affiche le type d'erreur 
    .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            errorMessage = "Saisie d'email invalide !"
            this.setState({error: errorMessage})
        } 
        else if (errorCode == 'auth/user-not-found'){
            errorMessage = "Cet utilisateur n'existe pas"
            this.setState({error: errorMessage})
        }
        else if(errorCode == 'auth/wrong-password'){
            errorMessage = "Mot de passe incorrect"
            this.setState({error : errorMessage})
        }
        else{
            errorMessage = "La connexion a échoué"
            this.setState({error: errorMessage})
        }
        this.setState({loading : false})
        this.setState({error: errorMessage})
    });
  }

  render() {

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        behavior = {"padding"}
        //onResponderRelease={ (e) => Keyboard.dismiss()}>
        >
        <View style={styles.header}>
          {/*renderIcon()*/}
          <RkText rkType='logo h0'>MC Servicing</RkText>
          <RkText rkType='light h3'>Carnet d'entretien numérique</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput rkType='rounded' keyboardType = 'email-address' placeholder='Identifiant' onChangeText={(text) => this.setState({id : text})}/>
            <RkTextInput rkType='rounded' placeholder='Mot de passe' onChangeText={(text) => this.setState({password : text})} secureTextEntry={true}/>
            <View style = {{alignItems:'center'}}>
              <RkText rkType='light h4 danger'>{this.state.error}</RkText>
            </View>
            <RkButton style={styles.save} onPress = {login} rkType='rounded connexion'
                      loading = {this.state.loading}
                      loadingRight>Connexion</RkButton>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Pas de compte?</RkText>
              <RkButton rkType='clear' onPress={() => this.props.navigation.navigate('Inscription')}>
                <RkText rkType='header6 italic'> Inscrivez vous ici ! </RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    height: scaleVertical(77),
    resizeMode: 'contain'
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.8
  },
  content: {
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    borderColor: theme.colors.border.solid
  },
  footer: {}
}));

RkTheme.setType('RkButton', 'connexion', {
  width: scaleHonrizontal(320),
  hitSlop: {top: 5, left: 5, bottom: 5, right: 5},
});

RkTheme.setType('RkText', 'italic', {
  text: {
    fontStyle : 'italic'
  }

});